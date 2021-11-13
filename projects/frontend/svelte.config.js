import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-vercel';
import { resolve } from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		vite: {
			resolve: {
				alias: {
					$stores: resolve('./src/stores'),
					$components: resolve('./src/components')
				}
			},
			envPrefix: 'ONUW_'
		}
	}
};

export default config;
