module.exports = function({ compilers }) {
    return {
        files: [
            'package.json',
            'tsconfig.json',
            'src/**/*.ts?(x)',
            '!src/**/?(*.)test.ts?(x)',
            '!src/**/?(*.)spec.ts?(x)',
            '!src/**/__tests__/**/*.ts?(x)',
        ],
        tests: [
            'src/**/?(*.)test.ts?(x)',
            'src/**/?(*.)spec.ts?(x)',
            'src/**/__tests__/**/*.ts?(x)',
        ],
        env: {
            type: 'node',
            runner: 'node',
        },
        testFramework: 'jest',
        compilers: {
            '**/*.ts?(x)': compilers.typeScript({
                module: 'commonjs',
            }),
        },
    }
}
