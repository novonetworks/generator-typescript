module.exports = function() {
    return {
        files: [
            'src/**/*.ts',
            'tsconfig.json',
            'package.json',
            '!src/**/__tests__/**/*.ts?(x)',
            '!src/**/?(*.)(spec|test).ts?(x)',
            '!test/**/*.ts?(x)'
        ],
        tests: [
            'src/**/__tests__/**/*.ts?(x)',
            'src/**/?(*.)(spec|test).ts?(x)',
            'test/**/*.ts?(x)'
        ],
        env: {
            type: 'node',
            runner: 'node'
        },
        testFramework: 'jest'
    }
}
