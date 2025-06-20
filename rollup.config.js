import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
    input: 'build/index.js',
    output: {
        file: 'dist/bundle.cjs',
        format: 'cjs',
        banner: '#!/usr/bin/env node'
    },
    plugins: [resolve(), commonjs(), json()],
    external: ['fs', 'path', 'os'] // Node.js built-ins
};