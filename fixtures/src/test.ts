import message from '~/sub'

test('sub module resolve correctly', () => {
    expect(message).toEqual('Hello Module!')
})

describe('one plus one', () => {
    const result = 1 + 1
    it('should be two', () => {
        expect(result).toEqual(2)
    })
})
