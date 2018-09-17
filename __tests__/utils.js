'use strict'
const { isNotEmpty } = require('../generators/app/utils')

describe('utils.js testing', () => {
    it('should isNotEmpty function return correctly', () => {
        expect(isNotEmpty('')).toBeFalsy()
        expect(isNotEmpty('something')).toBeTruthy()
    })
})
