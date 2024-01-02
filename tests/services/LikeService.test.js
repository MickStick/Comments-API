const LikeService = require('../../services/LikeService')

const dash = () => {
    throw new Error("Something went wrong! Contact admin for information!")
}

jest.mock('../../services/LikeService', () => {
    return jest.fn().mockImplementation(() => ({  
        addLike: jest.fn((body) => {if(body instanceof Object){return {}} dash()}),
        retrieveCommentLikes: jest.fn((id) => {if(/[0-9]/.test(id)){return []} dash()}),
        deleteLike: jest.fn((id) => {if(/[0-9]/.test(id)){return {}} dash()}),
        handleError: jest.fn((message) => {dash()}),
    }))
})

const likeService = new LikeService()

describe('Testing Like Service!', () => {
    it('Should add like', () => {
        let res = likeService.addLike({})
        expect(res).toBeDefined()
        expect(res instanceof Object).toBeTruthy()
    })

    it('Should throw error on add like ', () => {
        expect(() => likeService.addLike("invalid")).toThrow("Something went wrong! Contact admin for information!")
    })

    it('Should delete like', () => {
        let res = likeService.deleteLike(1)
        expect(res).toBeDefined()
        expect(res instanceof Object).toBeTruthy()
    })

    it('Should throw error on delete like', () => {
        expect(() => likeService.deleteLike("invalid")).toThrow("Something went wrong! Contact admin for information!")
    })

    it('Should retrieve post likes list', () => {
        let res = likeService.retrieveCommentLikes(1)
        expect(res).toBeDefined()
        expect(res instanceof Array).toBeTruthy()
    })

    it('Should throw error on post likes', () => {
        expect(() => likeService.retrieveCommentLikes("invalid")).toThrow("Something went wrong! Contact admin for information!")
    })

    it('Should throw an error', () => {
        expect(() => likeService.handleError("error-message")).toThrow("Something went wrong! Contact admin for information!")
    })
})