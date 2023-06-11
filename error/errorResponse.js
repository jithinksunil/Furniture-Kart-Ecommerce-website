const createError = require('http-errors');

class ErrorResponse extends Error {
    constructor(status,name, message) {
        super(message);
        this.status = status;
        this.name=name
    }

    static badRequest() {
        let err=createError(400)
        return new ErrorResponse(400,err.name, err.message);
    }
    
    static unauthorized() {
        let err=createError(401)
        return new ErrorResponse(401,err.name, err.message);
    }
    
    static forbidden() {
        let err=createError(403)
        return new ErrorResponse(403,err.name, err.message);
    }
    
    static notFound() {
        let err=createError(404)
        return new ErrorResponse(404,err.name, err.message);
    }
    
    static internalError() {
        let err=createError(500)
        return new ErrorResponse(500,err.name, err.message);
    }
}

module.exports=ErrorResponse
