function add(nums){
    let result = 0;
    for(let n of nums){
        result += n;
    }

    return result;
}

describe('Sum func', () => {
    it('add three int', () => {
        expect(add([1,2,3])).toBe(6)
    })
})

