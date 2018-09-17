'use strict'
const path = require('path')
const assert = require('yeoman-assert')
const helpers = require('yeoman-test')

describe('@novonetworks/generator-typescript:app', () => {
    beforeAll(() => {
        return helpers
            .run(path.join(__dirname, '../generators/app'))
            .withPrompts({ name: 'app-name' })
    })

    it('creates package.json files', () => {
        assert.file(['package.json'])
        assert.jsonFileContent('package.json', {
            name: 'app-name'
        })
    })
})
