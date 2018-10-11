'use strict'
const { isNotEmpty, npmInstallPromise } = require('./utils')
const Generator = require('yeoman-generator')
const chalk = require('chalk').default
const JSON_SPACE = 4

module.exports = class extends Generator {
    prompting() {
        this.log(
            `Welcome to the ${chalk.red(
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
                message: 'question repository url : '
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
            test: 'cross-env CI=true jest --colors',
            'test:watch': 'jest --watchAll',
            format: 'prettier --write "src/**/*"',
            'conflict-rules': 'tslint-config-prettier-check ./tslint.json'
        }

        const jest = {
            globals: {
                'ts-jest': {
                    tsConfigFile: '<rootDir>/tsconfig.json'
                }
            },
            collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
            moduleDirectories: ['<rootDir>/src', 'node_modules'],
            preset: 'ts-jest'
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
                'pre-commit': 'lint-staged'
            }
        }

        const lintStaged = {
            '*.{ts,tsx,js,jsx}': [
                'prettier --write',
                'tslint --fix',
                'git add'
            ],
            '*.{json,css}': ['prettier --write', 'git add']
        }

        this.spawnCommandSync('git', ['init'])
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
            'husky',
            'prettier',
            'lint-staged',
            'tslint',
            'tslint-config-prettier',
            'tslint-plugin-prettier'
        ]

        const types = ['@types/jest']
        npmInstallPromise
            .call(this, devDependencies.concat(types), {
                'save-dev': true
            })
            .then(() => {
                this.spawnCommandSync('git', ['add', '-A', '.'])
                this.spawnCommandSync('git', [
                    'commit',
                    '-m',
                    '"Initial commit"'
                ])
            })
            .catch(reason => {
                this.log(chalk.red(reason))
            })
    }
}
