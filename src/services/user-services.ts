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
                return await this.getUserById(+key);
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

    private async isUsernameAvailable(username: string): Promise<boolean>{

        try{
            await this.getUserByUniqueKey({'username': username});
        } catch(e){
            return true;
        }

        return false;

    }

    private async isEmailAvailable(email: string): Promise<boolean>{

        try{
            await this.getUserByUniqueKey({'email': email})
        } catch(e){
            return true;
        }

        return false;

    }

    updateUser(updateUser: User): Promise<User>{

        return new Promise<User>(async (resolve,reject) => {

            if (!isValidObject(updateUser, 'id') || !isValidId(updateUser.id)){
                reject(new InvalidInputError('Valid user was not input'));
                return;
            }

            try {
                resolve(await this.userRepo.update(updateUser));
            } catch (e){
                reject(e);
            }

        });

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

}