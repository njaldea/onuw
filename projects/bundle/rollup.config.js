// rollup.config.js
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';

const input = './package/index.js';

const onwarn = (warning, handler) => {
    if (warning.code === 'THIS_IS_UNDEFINED') return;
    handler(warning);
};

const svt = {
    include: 'package/**/*.svelte',
    emitCss: false,

    onwarn: (warning, handler) => {
        if (warning.code === 'a11y-distracting-elements') return;
        handler(warning);
    },
    compilerOptions: {
        generate: 'dom',
        hydratable: true,
        customElement: false
    }
};

const rsv = {
    browser: true,
    moduleDirectories: ['./src', './node_modules']
};

const plugins = [svelte(svt), resolve(rsv)];

export default [
    {
        input,
        output: [
            {
                file: 'out/iife.js',
                format: 'iife',
                name: 'Chess'
            },
            {
                file: 'out/es.js',
                format: 'es'
            }
        ],
        onwarn,
        // plugins: [...plugins, terser()]
        plugins: [...plugins]
    },
    {
        input,
        output: [
            {
                file: 'out/es.d.ts',
                format: 'es'
            }
        ],
        onwarn,
        plugins: [...plugins, dts()]
    }
];
