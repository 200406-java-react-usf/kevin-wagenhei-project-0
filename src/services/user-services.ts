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
import userData from '../data/user-db';

export class UserService{

    constructor(private userRepo: UserRepository){
        this.userRepo = userRepo;
    }

    getAllUsers(): Promise<User[]>{

        return new Promise<User[]>(async (resolve,reject) => {

            let result = await this.userRepo.getAll();

            if(result.length === 0){
                reject(new ResourceNotFoundError('No users in database'));
                return;
            }

            resolve(result);

        });

    }

    getUserById(id: number): Promise<User> {

        return new Promise<User>(async (resolve,reject) => {

            if(!isValidId(id)){
                reject(new InvalidInputError('Valid ID was not input'));
                return;
            }

            let result = {...await this.userRepo.getById(id)};

            if(!isEmptyObject(result)){
                reject(new ResourceNotFoundError('No user with that ID found'));
                return;
            }

            resolve(result);

        });

    }

    getUserByUniqueKey(queryObj: any): Promise<User>{

        return new Promise<User> (async (resolve, reject) => {

            try {

                let queryKeys = Object.keys(queryObj);

                if(!queryKeys.every(key => isPropertyOf(key, User))){
                    return reject(new InvalidInputError());
                }

                let key = queryKeys[0];
                let val = queryKeys[key];

                if(key === 'id'){
                    return resolve(await this.getUserById(+key));
                }

                if(!isValidString(val)){
                    return reject(new InvalidInputError());
                }

                let user = {...await this.userRepo.getUserByUniqueKey(key, val)};

                if(!isEmptyObject(user)){
                    return reject(new ResourceNotFoundError());
                }

                resolve(user);

            } catch (e) {

                reject(e);

            }

        });

    }

    addNewUser(newUser: User): Promise<User>{

        return new Promise<User> (async (resolve,reject) => {

            if(!isValidObject(newUser, 'id')){
                reject(new InvalidInputError('Valid Object was not input'));
                return;
            }

            //GET BY UNIQUE KEY
            let usernameConflict = userData.filter(user => user.username == newUser.username);
            let emailConflict = userData.filter(user => user.email === newUser.email);

            if(usernameConflict.length !== 0){
                reject(new ResourceConflictError('Username already exists'));
                return;
            }

            if(emailConflict.length !== 0){
                return reject(new ResourceConflictError('Email already in use'));
            }

            try{
                const persistedUser = await this.userRepo.save(newUser);
                resolve(persistedUser);
            } catch(e){
                reject(e);
            }

        });

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

    getUserByUsername(un: string): Promise<User> {

        return new Promise<User>(async (resolve,reject) => {

            if(!isValidString(un)){
                reject(new InvalidInputError('Valid string was not input'));
                return;
            }

            let result = await this.userRepo.getByUsername(un);

            if(!isEmptyObject(result)){
                reject(new ResourceNotFoundError('No user found with that username'));
                return;
            }

            resolve(result);

        });

    }

    getUserByCredentials(un: string, pw: string): Promise<User> {

        return new Promise<User>(async (resolve,reject) => {

            if(!isValidString(un, pw)){
                reject(new InvalidInputError('Valid string was not input'));
                return;
            }

            let result = await this.userRepo.getByCredentials(un, pw);

            if(!isEmptyObject(result)){
                reject(new AuthenticationError('Invalid credentials'));
                return;
            }

            resolve(result);

        });

    }

}