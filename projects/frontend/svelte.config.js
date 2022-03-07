import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-auto';
import adapternode from '@sveltejs/adapter-node';

const adapt = async (builder) => {
    builder.log.success('falling back to adapter-node');
    return adapternode().adapt(builder);
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: preprocess(),
    kit: {
        adapter: {
            name: 'onuw-adapter',
            adapt: async (builder) => {
                return (await adapter().adapt(builder)) ?? (await adapt(builder));
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
            if (!/(?:(?:^_|\/_)|(?:^\.|\/\.)(?!well-known))/.test(filepath)) {
                if (filepath.endsWith('.svelte')) {
                    filepath = filepath.slice('src/routes/'.length);
                    if (filepath.endsWith('index.svelte')) {
                        console.log(
                            '  - http://localhost:3000/' + filepath.slice(0, -'index.svelte'.length)
                        );
                    } else {
                        console.log(
                            '  - http://localhost:3000/' + filepath.slice(0, -'.svelte'.length)
                        );
                    }
                }
                return true;
            }
            return false;
        }
    }
};

export default config;
