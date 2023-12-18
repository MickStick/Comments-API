module.exports = class RestResponse {

    constructor(status = null, state = null, message = null, body = null, err = null){
        this.status = status;
        this.state = state;
        this.message = message;
        this.body = body;
        this.err = err
    }

    
}