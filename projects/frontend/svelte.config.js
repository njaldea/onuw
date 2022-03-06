import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-auto';
import adapternode from '@sveltejs/adapter-node';

const adapt = async (builder) => {
    builder.log.success("falling back to adapter-node");
    return adapternode().adapt(builder);
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: preprocess(),
    kit: {
        adapter: {
            name: "onuw-adapter",
            adapt: async (builder) => {
                return await adapter().adapt(builder) ?? await adapt(builder);
            }
        },
        vite: {
            resolve: {
                alias: {}
            },
            envPrefix: 'ONUW_'
        },
        package: {
            dir: '../bundle/package',
            exports: (filename) => filename === 'index.ts'
        },
        prerender: {
            default: true
        },
        routes: (filepath) => {
            const valid = !/(?:(?:^_|\/_)|(?:^\.|\/\.)(?!well-known))/.test(filepath);
            if (valid) {
                const subs = filepath.split('/').slice(2);
                if (!subs.includes('index.svelte')) {
                    const p = subs.join('/');
                    if (p.includes('.svelte')) {
                        console.log("  -", 'http://localhost:3000/' + p.substring(0, p.length - 7));
                    } else {
                        console.log("  -", 'http://localhost:3000/' + p);
                    }
                }
            }
            return valid;
        }
    }
};

export default config;
