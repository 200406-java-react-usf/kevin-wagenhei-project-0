import { UserRepository } from '../repos/user-repo';
import { User } from '../models/users';
import {
    isValidId, 
    isValidString,
    isValidObject,
    isEmptyObject,
    isPropertyOf
} from '../util/validator';
import {
    ResourceNotFoundError,
    AuthenticationError,
    ResourceConflictError,
    InvalidInputError
} from '../errors/errors';

export class UserService{

    constructor(private userRepo: UserRepository){
        this.userRepo = userRepo;
    }

    /** 
     * Retrieves an Array of Cards from the database
    */

    async getAllUsers(): Promise<User[]>{

        let result = await this.userRepo.getAll();

        if(result.length === 0){
            throw new ResourceNotFoundError('No users in database');
        }

        return result;

    }

    /**
     * Retrieves a Card given an ID
     * @param id {string} id : Unique number given to each card for Identification
     */

    async getUserById(id: number): Promise<User> {

        if(!isValidId(id)){
            throw new InvalidInputError('Valid ID was not input');
        }

        let result = await this.userRepo.getById(id);

        if(!isEmptyObject(result)){
            throw new ResourceNotFoundError('No user with that ID found');
        }

        return result;        

    }

    /**
     * Retrives a User from the database given a correct Key/Value pair.
     * @param queryObj {any} Object with the key and value to search for 
     */

    async getUserByUniqueKey(queryObj: any): Promise<User>{

        try {
            
            let queryKeys = Object.keys(queryObj);

            if(!queryKeys.every(key => isPropertyOf(key, User))){
                throw new InvalidInputError();
            }
            
            let key = queryKeys[0];
            let val = queryObj[key];

            if(key === 'id'){
                return await this.getUserById(val);
            }
            
            if(!isValidString(val)){
                throw new InvalidInputError();
            }
            
            let user = await this.userRepo.getUserByUniqueKey(key, val);
            
            if(!isEmptyObject(user)){
                throw new ResourceNotFoundError();
            }

            return user;

        } catch (e) {

            throw e;

        }

    }

    /**
     * Adds a new User to the database.
     * @param newUser {User} User Object
     */

    async addNewUser(newUser: User): Promise<User>{

        try{
            
            if(!isValidObject(newUser, 'id')){
                throw new InvalidInputError('Valid Object was not input');
            }

            let usernameConflict = await this.isUsernameAvailable(newUser.username);

            if(!usernameConflict){
                throw new ResourceConflictError('Username already exists');
            }

            let emailConflict = await this.isEmailAvailable(newUser.email);

            if(!emailConflict){
                throw new ResourceConflictError('Email already in use');
            }
            const persistedUser = await this.userRepo.save(newUser);
            return persistedUser;

        } catch (e){
            throw e;
        }    
    
    }

    /**
     * Checks to see if the username exists in the database
     * @param username {string} Username
     */

    async isUsernameAvailable(username: string): Promise<boolean>{

        try{
            await this.getUserByUniqueKey({'username': username});
        } catch(e){
            return true;
        }

        return false;

    }

    /**
     * Checks to see if the email exists in the database
     * @param email {string} Email
     */

    async isEmailAvailable(email: string): Promise<boolean>{

        try{
            await this.getUserByUniqueKey({'email': email});
        } catch(e){
            return true;
        }

        return false;

    }

    /**
     * Updates an existing user based on the values given in the user passed in. Uses ID to find and update the existing user.
     * @param updateUser {User} User Object
     */

    async updateUser(updateUser: User): Promise<User>{

        try{

            if (!isValidObject(updateUser, 'id') || !isValidId(updateUser.id)){
                throw new InvalidInputError('Valid user was not input');
            }

            let userToUpdate = await this.getUserById(updateUser.id);

            if(!userToUpdate){
                throw new ResourceNotFoundError('No user found to update');
            }

            let emailConflict = await this.isEmailAvailable(updateUser.email);

            if(userToUpdate.email === updateUser.email){
                emailConflict = true;
            }

            if(!emailConflict){
                throw new ResourceConflictError('Email already taken');
            }

            let usernameConflict = await this.isUsernameAvailable(updateUser.username);

            if(userToUpdate.username === updateUser.username){
                usernameConflict = true;
            }

            if(!usernameConflict){
                throw new ResourceConflictError('Username is already taken');
            }

            let persistedUser = await this.userRepo.update(updateUser);
            return persistedUser;

        } catch (e){
            throw e;
        }

    }

    /**
     * Retrieves a user given the username of the user.
     * @param un {string} Username of the User
     */

    async getUserByUsername(un: string): Promise<User> {

        if(!isValidString(un)){
            throw new InvalidInputError('Valid string was not input');
        }

        let result = await this.userRepo.getByUsername(un);

        if(!isEmptyObject(result)){
            throw new ResourceNotFoundError('No user found with that username');
        }

        return result;

    }

    /**
     * Retrieves a user given the user's username and password
     * @param un {string} Username
     * @param pw {string} Password
     */

    async getUserByCredentials(un: string, pw: string): Promise<User> {

        if(!isValidString(un, pw)){
            throw new InvalidInputError('Valid string was not input');
        }

        let result = await this.userRepo.getByCredentials(un, pw);

        if(!isEmptyObject(result)){
            throw new AuthenticationError('Invalid credentials');
        }

        return result;

    }

    /**
     * Deletes a card given the JSON object from the DELETE HTTP request
     * @param jsonObj {Object} JSON object from the DELETE HTTP request
     */

    async deleteUser(jsonObj: object): Promise<boolean>{

        let keys = Object.keys(jsonObj);
        let val = keys[0];

        let userID = +jsonObj[val];

        if(!isValidId(userID)){
            throw new InvalidInputError('Invalid ID was input');
        }

        let userToDelete = await this.getUserById(userID);

        if(!userToDelete){
            throw new ResourceNotFoundError('User does not exist, or was already deleted');
        }

        let persistedUser = await this.userRepo.deleteById(userID);
        
        return persistedUser;

    }

}