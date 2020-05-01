import { runInThisContext } from "vm";

class ResourceNotFoundError {

    message: string;
    statusCode: number;

    constructor(reason?: string){

        this.statusCode = 404;

        if(!reason){
            this.message = 'No Resource Found';
        }else{
            this.message = reason;
        }
        
    }

}

class AuthorizationError {

    message: string;
    statusCode: number;

    constructor(reason?: string){

        this.statusCode = 403;

        if(!reason){
            this.message = 'Authorization Error';
        } else{
            this.message = reason;
        }

    }

}

class InvalidInputError {

    message: string;
    statusCode: number;

    constructor(reason?: string){

        this.statusCode = 400;

        if(!reason){
            this.message = 'Invalid Input';
        } else{
            this.message = reason;
        }


    }

}

class ResourceConflictError {

    message: string;
    statusCode: number;

    constructor(reason?: string){

        this.statusCode = 409;

        if(!reason){
            this.message = 'Invalid Input';
        } else{
            this.message = reason;
        }


    }

}

class AuthenticationError {

    message: string;
    statusCode: number;

    constructor(reason?: string){

        this.statusCode = 401;

        if(!reason){
            this.message = 'Invalid Credentials';
        }else{
            this.message = reason;
        }
        
    }

}

export {
    ResourceNotFoundError,
    AuthenticationError,
    ResourceConflictError,
    InvalidInputError
};