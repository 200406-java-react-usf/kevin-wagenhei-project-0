class ResourceNotFoundError {

    message: string;

    constructor(reason?: string){

        if(!reason){
            this.message = 'No Resource Found';
        }else{
            this.message = reason;
        }
        
    }

}

class InvalidInputError {

    message: string;

    constructor(reason?: string){

        if(!reason){
            this.message = 'Invalid Input';
        } else{
            this.message = reason;
        }


    }

}

class ResourceConflictError {

    message: string;

    constructor(reason?: string){

        if(!reason){
            this.message = 'Invalid Input';
        } else{
            this.message = reason;
        }


    }

}

class AuthenticationError {

    message: string;

    constructor(reason?: string){

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