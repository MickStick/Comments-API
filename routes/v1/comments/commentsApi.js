let express = require('express');
let basicAuth = require('express-basic-auth')
let router = express.Router()
let CommentController = require('../../../controllers/CommentController')

let commentController = new CommentController();
//TODO
//Add caching
//Add proper headers

//adding basic auth
router.use(basicAuth({
    users: JSON.parse(process.env.BASIC_AUTH_USERS),
    challenge: true 
}))

/**
 * This endpoint is responsible for creating a new comment
 */
router.post("/create", async (req, res) => {
    return await commentController.registerComment(req, res)
})

/**
 * This endpoint is responsible for creating a new reply
 */
router.post("/reply", async (req, res) => {
    return await commentController.registerComment(req, res)
})

/**
 * This endpoint is responsible for updating a existing comment
 */
router.put("/update/:cid", async (req, res) => {
    return await commentController.updateComment(req, res)
})

/**
 * This endpoint is responsible for deleting a existing comment
 */
router.delete("/delete", async (req, res) => {
    return await commentController.deleteComment(req, res)
})


/**
 * This endpoint is responsible for retreiving all comments of a specified user.
 * For testing purposes
 */
router.get("/user/:id", async (req, res) => {
    if(process.env.NODE_ENV === "development"){
        //DO
        res.status(200)
        res.send("Nothing")
    }else{
        res.status(500);
        res.send("Internal Server Error")
    }
})

/**
 * This endpoint is responsible for retreiving all comments of a specified post.    
 */
router.get("/comments/:pid", async (req, res) => {
    return await commentController.getComments(req, res)
})

module.exports = router;