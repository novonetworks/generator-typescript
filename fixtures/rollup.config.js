import external from 'rollup-plugin-peer-deps-external'
import typescript from 'rollup-plugin-typescript2'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import pkg from './package.json'

export default {
    input: 'src/index.ts',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            exports: 'named',
            sourcemap: true,
        },
        {
            file: pkg.module,
            format: 'es',
            exports: 'named',
            sourcemap: true,
        },
    ],
    plugins: [
        external(),
        typescript({
            useTsconfigDeclarationDir: true,
            tsconfig: './tsconfig.json',
            tsconfigOverride: {
                declaration: true,
                declarationDir: 'lib',
                baseUrl: 'src',
                paths: {
                    '~/*': ['*'],
                },
                include: ['src'],
            },
            rollupCommonJSResolveHack: true,
            clean: true,
        }),
        resolve(),
        commonjs(),
    ],
}
