'use strict'
const packageJson = require('./package.json')
const Generator = require('yeoman-generator')
const chalk = require('chalk').default
const JSON_SPACE = 4

function isNotEmpty(message) {
    return message !== ''
}

module.exports = class extends Generator {
    prompting() {
        this.log(
            `Welcome to the ${chalk.red(
                '@novonetworks/generator-typescript',
            )} generator!`,
        )

        const appName = this.appname.replace(/\s+/g, '-')

        const prompts = [
            {
                type: 'input',
                name: 'name',
                message: `question name (${appName}): `,
                default: appName,
            },
            {
                type: 'input',
                name: 'version',
                message: `question version (1.0.0): `,
                default: '1.0.0',
            },
            {
                type: 'input',
                name: 'description',
                message: 'question description (Typescript Project): ',
                default: 'Typescript Project',
            },
            {
                type: 'input',
                name: 'repository',
                message: 'question repository url : ',
            },
            {
                type: 'input',
                name: 'author',
                message: 'question author: ',
            },
            {
                type: 'input',
                name: 'license',
                message: 'question license (MIT): ',
                default: 'MIT',
            },
            {
                type: 'input',
                name: 'private',
                message: 'question private: ',
            },
        ]

        return this.prompt(prompts).then(props => {
            this.props = props
        })
    }

    writing(rootPath) {
        this.fs.copy(
            this.templatePath('**/*'),
            this.destinationRoot(rootPath),
            { globOptions: { dot: true } },
        )

        this.fs.move(
            `${this.destinationPath()}/_gitignore`,
            `${this.destinationPath()}/.gitignore`,
        )

        this.fs.move(
            `${this.destinationPath()}/_editorconfig`,
            `${this.destinationPath()}/.editorconfig`,
        )

        this.fs.move(
            `${this.destinationPath()}/_npmignore`,
            `${this.destinationPath()}/.npmignore`,
        )

        this.fs.move(
            `${this.destinationPath()}/_travis.yml`,
            `${this.destinationPath()}/.travis.yml`,
        )

        this.spawnCommandSync('git', ['init'])
        this.fs.writeJSON(
            'package.json',
            {
                ...this.props,
                ...packageJson,
            },
            (key, value) => {
                return value || isNotEmpty(value) ? value : undefined
            },
            JSON_SPACE,
        )
    }

    install() {
        try {
            this.yarnInstall()
            this.spawnCommandSync('git', ['add', '-A', '.'])
            this.spawnCommandSync('git', ['commit', '-m', 'Initial commit'])
        } catch (reason) {
            this.log(chalk.red(reason))
        }
    }
}
