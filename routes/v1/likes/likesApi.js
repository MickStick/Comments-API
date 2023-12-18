let express = require('express');
let basicAuth = require('express-basic-auth')
let router = express.Router()
let LikeController = require('../../../controllers/LikeController');
let likeController = new LikeController();

//TODO
//Add caching
//Add proper headers

//adding basic auth
router.use(basicAuth({
    users: JSON.parse(process.env.BASIC_AUTH_USERS),
    challenge: true 
}))

/**
 * This endpoint is responsible for creating a new comment/reply like
 */
router.post("/add", async (req, res) => {
    return await likeController.registerLike(req, res)
})

/**
 * This endpoint is responsible for removing a comment/reply like
 */
router.delete("/delete", async (req, res) => {
    return await likeController.deleteLike(req, res)
})

/**
 * This endpoint is responsible for retreiving all comments of a specified post.    
 */
router.get("/likes/:id", async (req, res) => {
    return await likeController.getLikes(req, res)
})

module.exports = router;