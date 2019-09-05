'use strict'
const path = require('path')
const fs = require('fs-extra')
const assert = require('yeoman-assert')
const helpers = require('yeoman-test')
const fixtures = path.join(__dirname, '../fixtures')

async function readContent(pathname) {
    const content = await fs.readFile(path.join(fixtures, pathname))
    return content.toString('utf-8')
}

describe('@novonetworks/generator-typescript:app', () => {
    beforeAll(() => {
        return helpers
            .run(path.join(__dirname, '../generators/app'))
            .withPrompts({ name: 'app-name' })
    })

    it('create src/index.ts file', async () => {
        const content = await readContent('/src/index.ts')
        assert.fileContent('./src/index.ts', content)
    })

    it('create .editorconfig file', async () => {
        const content = await readContent('.editorconfig')
        assert.fileContent('.editorconfig', content)
    })

    it('create .gitignore file', async () => {
        const content = await readContent('.gitignore')
        assert.fileContent('.gitignore', content)
    })

    it('create .npmignore.yml file', async () => {
        const content = await readContent('.npmignore')
        assert.fileContent('.npmignore', content)
    })

    it('create .travis.yml file', async () => {
        const content = await readContent('.travis.yml')
        assert.fileContent('.travis.yml', content)
    })

    it('create package.json file', async () => {
        const content = await readContent('package.json')
        assert.fileContent('package.json', content)
    })

    it('create README.md file', async () => {
        const content = await readContent('README.md')
        assert.fileContent('README.md', content)
    })

    it('create rollup.config.js file', async () => {
        const content = await readContent('rollup.config.js')
        assert.equalsFileContent('rollup.config.js', content)
    })

    it('create tsconfig.json file', async () => {
        const content = await readContent('tsconfig.json')
        assert.fileContent('tsconfig.json', content)
    })

    it('create wallaby.js file', async () => {
        const content = await readContent('wallaby.js')
        assert.fileContent('wallaby.js', content)
    })

    it('create yarn.lock file', async () => {
        const content = await readContent('yarn.lock')
        assert.fileContent('yarn.lock', content)
    })
})
