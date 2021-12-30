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
                file: 'dist/iife/index.js',
                format: 'iife',
                name: 'njaldea_demo'
            },
            {
                file: 'dist/cjs/index.cjs',
                format: 'cjs',
                exports: 'auto'
            },
            {
                file: 'dist/esm/index.mjs',
                format: 'es'
            }
        ],
        onwarn,
        plugins: [...plugins]
    },
    {
        input,
        output: [
            {
                file: 'dist/types/index.d.ts',
                format: 'es'
            }
        ],
        onwarn,
        plugins: [...plugins, dts()]
    }
];
