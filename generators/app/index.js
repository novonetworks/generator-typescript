'use strict'
import { isNotEmpty } from './utils'

const Generator = require('yeoman-generator')
const chalk = require('chalk')

module.exports = class extends Generator {
    prompting() {
        this.log(
            `Welcome to the ${chalk.default.red(
                '@novonetworks/generator-typescript'
            )} generator!`
        )

        const prompts = [
            {
                type: 'input',
                name: 'name',
                message: `question name (${this.appname}): `,
                default: this.appname
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
                message: 'question description: '
            },
            {
                type: 'input',
                name: 'main',
                message: 'question entry point (src/index.ts): ',
                default: 'src/index.ts'
            },
            {
                type: 'input',
                name: 'url',
                message: 'question repository url: '
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

    writing() {
        this.fs.copy(this.templatePath('.'), this.destinationPath('.'))

        const scripts = {
            start: 'ts-node src/index.ts'
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
                scripts: scripts
            },
            (key, value) => {
                return value || isNotEmpty(value) ? value : undefined
            }
        )
    }

    async install() {
        const dependencies = []
        const devDependencies = ['typescript', 'ts-node']
        await this.npmInstall(dependencies)
        await this.npmInstall(devDependencies, { 'save-dev': true })
    }
}
