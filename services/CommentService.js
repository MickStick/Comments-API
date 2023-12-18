const Log = require('../utility/Log');
let db = require('../config/database'); //import db config
let Sequelize = require('sequelize')
let { QueryTypes } = require('sequelize')
const Comments = require('../models/comments')(db, Sequelize.DataTypes); //import db model

class CommentService {
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
     * This is a method that, using the sequelize Comments model, should create and add
     * to the database, a new Comments object/record.  
     * Eg. body  
     * {  
     *    uid : number,  
     *    pid : number,  
     *    replyTo : number,// a comment id | null  
     *    comment : string  
     * }  
     * @param {Object} body - JSON Oject conatining endorment record data 
     * @returns {Comments} Response Object
     */
    async addCommentData(body) {
        const resData = await Comments.create(body)

        if (resData == null || resData == "undefined") {
            Log.error(body?.comment)
            handleError("Error adding comment to DB!")
        }

        return resData;
    }

     /**
     * This is a method that, using the sequelize Comments model, should update a specified
     * comment object determined by the comment id.
     * @param {Number} id 
     * @param {Object} body 
     * @returns {Comments} Response Object
     */
     async updateComment(id, body) {
        const dbRes = await Comments.update({body,
            where: {
                id: id
            }
        })

        if (dbRes == null || dbRes == "undefined") {
            handleError("Error updating comment " + id + " from DB!");
        }

        return dbRes;
    }

    /**
     * This is a method that, using the sequelize Comments model, should delete a specified
     * comment object determined by the comment id.
     * @param {Number} id 
     * @returns {Comments} Response Object
     */
    async deleteComment(id) {
        const dbRes = await Comments.update(
            {
                status: -1
            },{
                where: {
                    id: id
                }
            }
        )

        if (dbRes == null || dbRes == "undefined") {
            handleError("Error delete comment " + id + " from DB!");
        }

        return dbRes;
    }

    /**
     * This is a method that, using the sequelize Comments model, should get a list of
     * Comments objects/records for a specific user
     * For testing purposes only
     * @returns {Comments} Response Object
     */
    async retreiveUserCommentsList(id) {
        if(process.env.NODE_ENV != "development") handleError("Sorry, I can't do that!");

        const resData = await Comments.findAll({
            where: {
                uid: id
            }
        })

        if (resData == null || resData == "undefined") {
            handleError("Error retreiving list of Comments from DB!");
        }

        return resData;
    }

     /**
     * This is a method that, using the sequelize Comments model, should get a list of
     * Comments objects/records for a specific post. Each comment record should include 
     * a list of replies and a count of likes
     * @returns {Comments} Response Object
     */
     async retreivePostComments(id) {
        /**
         * The Query should follow this:
         *  SELECT Suppliers.SupplierID, SupplierName, (SELECT CONCAT('[',
            GROUP_CONCAT(DISTINCT(
            JSON_OBJECT("SupplierID", Suppliers.SupplierID, "SupplierName", Suppliers.SupplierName))), ']') 
            FROM Suppliers Where Suppliers.Country = "Germany")
            AS GERMS, (SELECT COUNT(ProductID) FROM Products WHERE Suppliers.SupplierID = Products.SupplierID)
            AS NumberOfProducts
            FROM Suppliers
            WHERE Suppliers.Country = "USA";
         */
        // const resData = await Comments.findAll({
        //     where: {
        //         id: id,
        //         status: 1 | 0
        //     }
        // })

        let queryStr = "SELECT *, "
        + "(SELECT CONCAT('[',"
        + "GROUP_CONCAT(JSON_OBJECT('cid', Comments.id,'uid', Comments.uid, 'pid', Comments.pid, 'replyTo', Comments.replyTo, "
        + "'comment', Comments.comment, 'createdAt', Comments.createdAt, 'updatedAt', Comments.updatedAt)) "
        + ",']') "
        + "FROM Comments WHERE Comments.replyTo = Comm.id AND Comments.status = 1) "
        + "AS replies, "
        + "(SELECT COUNT(Likes.id) FROM Likes WHERE Likes.cid = Comm.id)"
        + "AS likes "
        + "FROM Comments Comm "
        + "WHERE Comm.replyTo IS NULL AND Comm.status = 1 AND Comm.pid = " + id;


        const resData = await db.query(queryStr, 
        { type: QueryTypes.SELECT });

        if (resData == null || resData == "undefined") {
            handleError("Error retreiving list of approved Comments from DB!");
        }

        return resData;
    }
}

module.exports = CommentService