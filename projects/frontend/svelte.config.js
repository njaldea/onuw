import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: preprocess(),

    kit: {
        adapter: adapter(),
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
        }
    }
};

export default config;
