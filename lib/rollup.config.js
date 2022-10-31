import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import pkg from './package.json';

export default [
    {
        input: './src/index.ts',
        output: {
            name: 'Relewise',
            file: pkg.browser,
            format: 'umd',
            sourcemap: true
        },
        external: ['@relewise/client'],
        plugins: [
            typescript({ tsconfig: './tsconfig.json' }),
            json(),
            resolve(),
            commonjs(),
        ]
    },
    {
        input: './src/index.ts',
        output: [
            { file: pkg.main, format: 'cjs', sourcemap: true },
            { file: pkg.module, format: 'es', sourcemap: true },
        ],
        plugins: [
            typescript({ tsconfig: './tsconfig.json' }),
        ]
    },
]