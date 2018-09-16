'use strict'
const { isNotEmpty } = require('./utils')
const Generator = require('yeoman-generator')
const chalk = require('chalk')
const JSON_SPACE = 4

module.exports = class extends Generator {
    prompting() {
        this.log(
            `Welcome to the ${chalk.default.red(
                '@novonetworks/generator-typescript'
            )} generator!`
        )

        const appName = this.appname.replace(/\s+/g, '-')

        const prompts = [
            {
                type: 'input',
                name: 'name',
                message: `question name (${appName}): `,
                default: appName
            },
            {
                type: 'input',
                name: 'version',
                message: `question version (1.0.0): `,
                default: '1.0.0'
            },
            {
                type: 'input',
                name: 'description',
                message: 'question description (Typescript Project): ',
                default: 'Typescript Project'
            },
            {
                type: 'input',
                name: 'main',
                message: 'question entry point (src/index.ts): ',
                default: 'src/index.ts'
            },
            {
                type: 'input',
                name: 'repository',
                message:
                    'question repository url (github.com/novonetworks/generator-typescript): ',
                default: 'https://github.com/novonetworks/generator-typescript'
            },
            {
                type: 'input',
                name: 'author',
                message: 'question author: '
            },
            {
                type: 'input',
                name: 'license',
                message: 'question license (MIT): ',
                default: 'MIT'
            },
            {
                type: 'input',
                name: 'private',
                message: 'question private: '
            }
        ]

        return this.prompt(prompts).then(props => {
            this.props = props
        })
    }

    writing(rootPath) {
        this.fs.copy(this.templatePath('**/*'), this.destinationRoot(rootPath))
        this.fs.copy(this.templatePath('**/.*'), this.destinationRoot(rootPath))

        const scripts = {
            start: 'ts-node src/index.ts',
            build: 'tsc',
            lint: 'tslint src/**/*.ts',
            test: 'cross-env CI=true jest --coverage --colors --reporters',
            'test:watch': 'jest --watchAll',
            format: 'prettier --write "src/**/*"',
            'pre-commit': 'npm-run-all test lint-staged',
            'lint-staged': 'lint-staged'
        }

        const jest = {
            globals: {
                'ts-jest': {
                    tsConfigFile: '<rootDir>/tsconfig.json'
                }
            },
            collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
            moduleDirectories: ['<rootDir>/src', 'node_modules'],
            moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx'],
            testEnvironment: 'node',
            testMatch: ['**/?(*.)(spec|test).(j|t)s?(x)', '**/__tests__/**/*.(j|t)s?(x)'],
            transform: {
                '^.+\\.(ts|tsx)?$': 'ts-jest'
            },
            transformIgnorePatterns: [
                '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|ts|tsx)$'
            ]
        }

        const prettier = {
            parser: 'typescript',
            semi: false,
            singleQuote: true,
            overrides: [
                {
                    files: '*.json',
                    options: {
                        parser: 'json'
                    }
                }
            ]
        }

        const husky = {
            hooks: {
                'pre-commit': 'npm run pre-commit'
            }
        }

        const lintStaged = {
            '*.{ts,tsx,js,jsx}': ['prettier --write', 'tslint --fix', 'git add'],
            '*.{json,css,md}': ['prettier --write', 'git add']
        }

        this.fs.writeJSON(
            'package.json',
            {
                name: this.props.name,
                version: this.props.version,
                description: this.props.description,
                main: this.props.main,
                repository: this.props.repository,
                author: this.props.author,
                license: this.props.license,
                private: this.props.private,
                scripts: scripts,
                jest: jest,
                husky: husky,
                'lint-staged': lintStaged,
                prettier: prettier
            },
            (key, value) => {
                return value || isNotEmpty(value) ? value : undefined
            },
            JSON_SPACE
        )
    }

    install() {
        const devDependencies = [
            'typescript',
            'ts-node',
            'jest',
            'ts-jest',
            'cross-env',
            'npm-run-all',
            'husky@next',
            'prettier',
            'lint-staged',
            'tslint',
            'tslint-config-prettier'
        ]

        const types = ['@types/jest']

        this.spawnCommandSync('git', ['init'])
        this.npmInstall(devDependencies.concat(types), { 'save-dev': true })
        this.spawnCommandSync('npm-run-all', ['test', 'lint-staged'])
    }
}
