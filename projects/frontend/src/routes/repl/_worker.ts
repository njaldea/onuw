import * as rollup from 'rollup/dist/es/rollup.browser.js';
import { compile } from 'svelte/compiler';
import path from 'path';

interface Component {
    name: string;
    type: string;
    source: string;
}

// you could use unpkg like the official repl, i thought i'd try out jsdelivr
const CDN_URL = 'https://cdn.jsdelivr.net/npm';

async function fetchAsText(url: string): Promise<string> {
    return (await fetch(url)).text();
}

interface Detail {
    tags: string[],
    prefix: string,
    assets: string
}

self.addEventListener('message', async (event: MessageEvent<Detail>): Promise<void> => {
    const { tags, prefix, assets } = event.data;
    const module_cache: Map<string, string> = new Map();
    module_cache.set('./index.js', tags.map(tag => `export { default as ${tag} } from './${tag}.svelte';`).join());
    const bundle = await rollup.rollup({
        input: './index.js',
        plugins: [
            {
                name: 'repl-plugin',
                async resolveId(importee: string, importer: string) {
                    if (importee === 'svelte') {
                        return `${CDN_URL}/svelte/index.mjs`;
                    }

                    if (importee.startsWith('svelte/')) {
                        return `${CDN_URL}/svelte/${importee.slice(7)}/index.mjs`;
                    }

                    if (importer && importer.startsWith(`${CDN_URL}/svelte`)) {
                        const resolved = new URL(importee, importer).href;
                        if (resolved.endsWith('.mjs')) {
                            return resolved;
                        }
                        return `${resolved}/index.mjs`;
                    }

                    if (importee.startsWith('onuw/')) {
                        return importee.replace('onuw/', `${location.origin}/assets/`);
                    }

                    if (module_cache.has(importee)) {
                        return importee;
                    }

                    if (importee.startsWith('.')) {
                        try {
                            // throws is importer a relative path (runtime provided);
                            new URL(importer);
                            return new URL(importee, importer).href;
                        } catch {
                            const url = './' + path.join(path.dirname(importer), importee);
                            module_cache.set(url, null);
                            return url;
                        }
                    }

                    // bare named module imports (importing an npm package)
                    // get the package.json and load it into memory
                    const pkg_url = `${CDN_URL}/${importee}/package.json`;
                    const pkg = JSON.parse(await fetchAsText(pkg_url));

                    // get an entry point from the pkg.json - first try svelte, then modules, then main
                    if (pkg.svelte || pkg.module || pkg.main) {
                        // use the aobove url minus `/package.json` to resolve the URL
                        const url = pkg_url.replace(/\/package\.json$/, '');
                        return new URL(pkg.svelte || pkg.module || pkg.main, `${url}/`).href;
                    }

                    // we probably missed stuff, pass it along as is
                    return importee;
                },
                async load(id: string) {
                    if (module_cache.has(id)) {
                        let data = module_cache.get(id);
                        if (data == null) {
                            data = await fetchAsText(`/repl/data?path=${id.replace(/\//g, '%2F')}`);
                            module_cache.set(id, data);
                        }
                        return data;
                    }

                    const text = await fetchAsText(id);
                    module_cache.set(id, text);
                    return text;
                },
                transform(code: string, id: string) {
                    // our only transform is to compile svelte components
                    //@ts-ignore
                    if (/.*\.svelte/.test(id)) {
                        return compile(code).js.code;
                    }
                }
            }
        ]
    });

    // a touch longwinded but output contains an array of chunks
    // we are not code-splitting, so we only have a single chunk
    const output: string = (await bundle.generate({ format: 'esm' })).output[0].code;

    self.postMessage(output);

    self.close();
});
