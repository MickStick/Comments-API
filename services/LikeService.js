const Log = require('../utility/Log');
let db = require('../config/database'); //import db config
let Sequelize = require('sequelize')
const Likes = require('../models/likes')(db, Sequelize.DataTypes); //import db model

class LikeService {
    constructor(){

    }

    /**
     * This method handled unexpected generic errors, with a specified message to be logged
     * @param {string} message - Message to be displayed/logged
     * @throws {Error} generic error
     */
    handleError(message){
        Log.error(message)
        throw new Error("Something went wrong! Contact admin for information!")
    }

    /**
     * This is a method that, using the sequelize Likes model, should create and add
     * to the database, a new Likes object/record.  
     * Eg. body  
     * {  
     *    uid : number,  
     *    cid : number
     * }  
     * @param {Object} body - JSON Oject conatining endorment record data 
     * @returns {Likes} Response Object
     */
    async addLike(body) {
        const resData = await Likes.create(body)

        if (resData == null || resData == "undefined") {
            Log.error(body?.like)
            handleError("Error adding like to DB!")
        }       

        return resData;
    }

    /**
     * This is a method that, using the sequelize Likes model, should get a list of
     * Likes objects/records for a specific comment
     * For testing purposes only
     * @returns {Comments} Response Object
     */
    async retreiveCommentLikes(id) {
        if(process.env.NODE_ENV != "development") handleError("Sorry, I can't do that!");

        const resData = await Likes.findAll({
            where: {
                cid: id,
                status: 1
            }
        })

        if (resData == null || resData == "undefined") {
            handleError("Error retreiving list of Comments from DB!");
        }

        return resData;
    }

    /**
     * This is a method that, using the sequelize Likes model, should get a list of
     * Likes objects/records for a specific comment
     * For testing purposes only
     * @returns {Comments} Response Object
     */
    async getLike(id) {
        if(process.env.NODE_ENV != "development") handleError("Sorry, I can't do that!");

        const resData = await Likes.findAll({
            where: {
                id: id,
                status: 1
            }
        })

        if (resData == null || resData == "undefined") {
            handleError("Error retreiving list of Comments from DB!");
        }

        return resData;
    }

    /**
     * This is a method that, using the sequelize Likes model, should delete a specified
     * like object determined by the like id.
     * @param {Number} id 
     * @returns {Likes} Response Object
     */
    async deleteLike(id) {
        const dbRes = await Likes.update(
            {
                status: -1
            },
            {
                where: {
                    id: id
                }
            }
        )

        if (dbRes == null || dbRes == "undefined") {
            handleError("Error delete like" + id + " from DB!");
        }

        return dbRes;
    }

    
}

module.exports = LikeService