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

    async getAllUsers(): Promise<User[]>{

        let result = await this.userRepo.getAll();

        if(result.length === 0){
            throw new ResourceNotFoundError('No users in database');
        }

        return result;

    }

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

    async isUsernameAvailable(username: string): Promise<boolean>{

        try{
            await this.getUserByUniqueKey({'username': username});
        } catch(e){
            return true;
        }

        return false;

    }

    async isEmailAvailable(email: string): Promise<boolean>{

        try{
            await this.getUserByUniqueKey({'email': email});
        } catch(e){
            return true;
        }

        return false;

    }

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