const CommentService = require('../../services/CommentService')

const dash = () => {
    throw new Error("Something went wrong! Contact admin for information!")
}

/**
 * Mocking the CommentService
 * Each mock method is designed to be used for both pass and fail case
 */
jest.mock('../../services/CommentService', () => {
    return jest.fn().mockImplementation(() => ({ 
        addCommentData : jest.fn((body) => {if(body instanceof Object){return {}} dash()}),
        updateComment : jest.fn((id, body) => {if(/[0-9]/.test(id) && body instanceof Object){ return {}} dash()}),
        deleteComment : jest.fn((id) => {if(/[0-9]/.test(id)){return {}} dash()}),
        retrievePostComments : jest.fn((id) => {if(/[0-9]/.test(id)){return []} dash()}),
        handleError: jest.fn((message) => {dash()}),
    }))
})

const commentService = new CommentService()

describe('Testing Comment Service!', () => {
    it('Should add comment', () => {
        let res = commentService.addCommentData({})
        expect(res).toBeDefined()
        expect(res instanceof Object).toBeTruthy()
    })

    it('Should throw error on add comment', () => {
        expect(() => commentService.addCommentData("invalid")).toThrow("Something went wrong! Contact admin for information!")
    })

    it('Should update comment', () => {
        let res = commentService.updateComment(1, {})
        expect(res).toBeDefined()
        expect(res instanceof Object).toBeTruthy()
    })

    it('Should throw error on update comment', () => {
        expect(() => commentService.updateComment("invalid")).toThrow("Something went wrong! Contact admin for information!")
    })

    it('Should delete comment', () => {
        let res = commentService.deleteComment(1)
        expect(res).toBeDefined()
        expect(res instanceof Object).toBeTruthy()
    })

    it('Should throw error on delete comment', () => {
        expect(() => commentService.deleteComment("invalid")).toThrow("Something went wrong! Contact admin for information!")
    })

    it('Should retrieve post comments list', () => {
        let res = commentService.retrievePostComments(1)
        expect(res).toBeDefined()
        expect(res instanceof Array).toBeTruthy()
    })

    it('Should throw error on post comments', () => {
        expect(() => commentService.retrievePostComments("invalid")).toThrow("Something went wrong! Contact admin for information!")
    })

    it('Should throw an error', () => {
        expect(() => commentService.handleError("error-message")).toThrow("Something went wrong! Contact admin for information!")
    })
})