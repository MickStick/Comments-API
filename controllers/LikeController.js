const LikeService = require("../services/LikeService");
const RestResponse = require('../utility/RestResponse');
const CommentController = require("./CommentController")
const Log = require("../utility/Log");
const NodeCache = require('node-cache');
const cache = new NodeCache();

class LikeController {

    constructor(){
        this.likeService = new LikeService();
    }

    /**
     * This method is responsible for validating the request body sent over when adding or updaing
     * an comment record.
     * @param {Object} obj - JSON Object containing endorsement data
     * @returns {Object} errList - Array of string messages detailing validation errors
     */
    validateLikeObject(obj){

        let errList = [];
        let numReg = /[0-9]/;

        //validate User ID
        Log.inform("Valiating Like User ID!");
        if(obj.uid == "undefined" 
        || obj.uid == null 
        || !numReg.test(obj.uid)){
            errList.push("Invalid User ID! User ID must be a number!");
        }

        //validate Comment ID
        Log.inform("Valiating Like Comment ID!");
        if(obj.cid == "undefined" 
        || obj.cid == null 
        ||  !numReg.test(obj.cid)){
            errList.push("Invalid Comment ID! Comment ID must be a number!");
        }

        return errList;
    }

    /**
     * this method is for handling 500 error responses using the Express Response
     * Object. A specific message is logged as well.
     * 
     * @param {Object} res - Express Response Object
     * @param {Error} err - Error Object to be returned
     * @param {String} msg - Friendly error message summary
     * @returns 
     */
    handle500Error(res, err, msg){
        let response = new RestResponse()
        Log.error(err.message ? err.message : JSON.stringify(err));
        res.status(500);
        response.status = 500;
        response.state = "failed";
        response.message = msg;
        response.err = {
            message: err.message,
            err: err.name.toLowerCase().includes("sequelize" || "sql" || "query") ? new Error(err.message) : err
        };
        return res.json(response)
    }

    /**
     * this method is for handling not found error responses using the Express Response
     * Object. A specific message is logged as well.
     * 
     * @param {Object} res - Express Response Object
     * @param {Error} err - Error Object to be returned
     * @param {String} msg - Friendly error message summary
     * @returns 
     */
    handle404Error(res, err, msg){
        let response = new RestResponse()
        Log.error(err.message ? err.message : JSON.stringify(err));
        res.status(404);
        response.status = 404;
        response.state = "notfound";
        response.message = msg;
        response.err = {
            message: err.message,
            err: err
        };
        return res.json(response)
    }

    async registerLike(req, res){
        let {body} = req;
        console.log("Body: ", req.body)

        let errMsg = this.validateLikeObject(body);
        let response = new RestResponse()

        if(errMsg.length > 0){
            let err = new Error(JSON.stringify(errMsg))
            return this.handle500Error(res, err, "Validation Error!");
        }

        try{
            body.status = 0;
            //TODO

            //Check if comment exists and continue appropriately
            Log.inform("Checking if comment with ID: " + body.cid + " exists!")
            let comCtl = new CommentController()
            if(await !comCtl.doesCommentExist(body.cid)){
                let err = new Error("Cannot Find Comment with ID: " + body.cid);
                this.handle404Error(res, err, "404 No Comment Found!")
            }
            Log.success("Comment found! Can proceed with the like.")

            //Ensure that this like isn't already there an active
            Log.inform("Attempting to add comment like.")
            let dbRes = await this.likeService.addLike(body);

            if(dbRes == null || dbRes == "undefined"){
                let err = new Error("Something went wrong! Contact admin for information!");
                return this.handle500Error(res, err, "Internal Server Error!");
            }

            response.status = 200;
            response.state = "success";
            response.message = "Like has been added successfully!";
            response.body = dbRes;
            Log.success("Like has been added successfully!");
            res.status(response.status);
            return res.json(response);
            
        }catch(err){
            return this.handle500Error(res, err, "Internal Server Error!");
        }
        
    }

    async getLikes(req, res){

        let {cid} = req.params;

        let response = new RestResponse()

        try{
            let dbRes;
            
            if(cache.has("LL-"+cid)){
                Log.inform("Attempting to retreive comment likes for ", cid)
                dbRes = cache.get("LL-" + cid)
                Log.inform("Retreived like list from cache!")
            }else{
                //Check if comment exists and continue appropriately
                Log.inform("Checking if comment with ID: " + cid + " exists!")
                let comCtl = new CommentController()
                if(await !comCtl.doesCommentExist(cid)){
                    let err = new Error("Cannot Find Comment with ID: " + cid);
                    this.handle404Error(res, err, "404 No Comment Found!")
                }
                Log.success("Comment found! Can proceed with the like.")

                Log.inform("Attempting to retreive comment likes for ", cid)
                dbRes = await this.likeService.retreiveCommentLikes(cid);

                if(dbRes == null || dbRes == "undefined"){
                    let err = new Error("Something went wrong! Contact admin for information!");
                    return this.handle500Error(res, err, "Internal Server Error!");
                }

                if(dbRes.length < 1){
                    let err = new Error("Cannot find any Like records!");
                    return this.handle404Error(res, err, "Internal Server Error!");
                }

                Log.inform("Caching Likes list!")
                dbRes = cache.set("LL-" + cid, dbRes, 3600)
            }

            response.status = 200;
            response.state = "success";
            response.message = "Likes have been retreived!";
            response.body = dbRes;
            Log.success("Likes have been retreived!");
            res.status(response.status);
            return res.json(response);

        }catch(err){
            return this.handle500Error(res, err, "Internal Server Error!");
        }

    }

    async deleteLike(req, res){
        let {pid} = req.params;

        let response = new RestResponse()

        if(errMsg.length > 0){
            let err = new Error(JSON.stringify(errMsg))
            return this.handle500Error(res, err, "Validation Error!");
        }

        try{
            body.status = 0;
            Log.inform("Attempting to delete comment like.")
            let dbRes = await this.likeService.deleteLike(pid);

            if(dbRes == null || dbRes == "undefined"){
                let err = new Error("Something went wrong! Contact admin for information!");
                return this.handle500Error(res, err, "Internal Server Error!");
            }

            response.status = 200;
            response.state = "success";
            response.message = "Like has been added successfully!";
            response.body = dbRes;
            Log.success("Like has been added successfully!");
            res.status(response.status);
            return res.json(response);
            
        }catch(err){
            return this.handle500Error(res, err, "Internal Server Error!");
        }
        
    }

}

module.exports = LikeController;