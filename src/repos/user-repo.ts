import {CrudRepository} from './crud-repo';
import {User} from '../models/users';
import userData from '../data/user-db';
import {isValidString, isValidObject, isValidId} from '../util/validator';
import {ResourceNotFoundError, InvalidInputError, ResourceConflictError, AuthenticationError} from '../errors/errors';

export class UserRepository implements CrudRepository<User> {

    private static instance: UserRepository;

    constructor () {}

    static getInstance(){
        return !UserRepository.instance ? UserRepository.instance = new UserRepository() : UserRepository.instance;
    }

    getAll(): Promise<User[]>{

        return new Promise<User[]>((resolve, reject) => {

            setTimeout(() => {

                let users: User[] = [];

                for (let user of userData){
                    users.push({...user});
                }

                if(users.length === 0){
                    reject(new ResourceNotFoundError('No users in database'));
                    return;
                }

                resolve(users);

            },1000);

        });

    }

    getById(id: number): Promise<User>{

        return new Promise<User>((resolve,reject) => {

            if(!isValidId(id)){
                reject(new InvalidInputError('Valid ID was not input'));
                return;
            }

            setTimeout(() => {

                const user: User = userData.filter(user => user.id === id).pop() as User;

                if(Object.keys(user).length == 0){
                    reject(new ResourceNotFoundError('No user with that ID found'));
                    return;
                }

                resolve(user);

            },1000);

        });

    }

    save(newUser: User): Promise<User>{

        return new Promise<User> ((resolve,reject) => {

            if(!isValidObject(newUser, 'id')){
                reject(new InvalidInputError('Valid Object was not input'));
                return;
            }

            setTimeout(() => {

                let usernameConflict = userData.filter(user => user.username == newUser.username);
                let emailConflict = userData.filter(user => user.email === newUser.email);

                if(usernameConflict.length !== 0){
                    reject(new ResourceConflictError('Username already exists'));
                    return;
                }

                if(emailConflict.length !== 0){
                    reject(new ResourceConflictError('Email already in use'));
                }

                newUser.id = (userData.length) + 1;
                userData.push(newUser);
                resolve(newUser);

            },1000);

        });

    }

    update(updatedUser: User): Promise<User>{

        return new Promise<User>((resolve, reject) => {

            if (!isValidObject(updatedUser, 'id') || !isValidId(updatedUser.id)){
                reject(new InvalidInputError('Valid user was not input'));
                return;
            }

            setTimeout(() => {

                let userToUpdate = userData.find(user => user.id === updatedUser.id);

                if(!userToUpdate){
                    reject(new ResourceNotFoundError('No user found to update'));
                    return;
                }

                if(userToUpdate.username !== updatedUser.username){
                    reject(new ResourceConflictError('Cannot update username'));
                    return;
                }

                const conflict = userData.filter(user => {
                    if(user.id === updatedUser.id){
                        return false;
                    }
                    return user.email == updatedUser.email;
                }).pop();
                
                if(conflict){
                    reject(new ResourceConflictError('Email already exists in the database'));
                    return;
                }

                userToUpdate = updatedUser;
                resolve(updatedUser);

            },1000);

        });

    }

    deleteById(id: number): Promise<boolean>{

        return new Promise<boolean>((resolve,reject) => {



        });

    }

    getByUsername(un: string): Promise<User>{

        return new Promise<User>((resolve,reject) => {

            if(!isValidString(un)){
                reject(new InvalidInputError('Valid string was not input'));
                return;
            }

            setTimeout(() => {

                let foundUser = {...userData.filter(user => user.username === un).pop() as User};

                if(Object.keys(foundUser).length === 0){
                    reject(new ResourceNotFoundError('No user found with that username'));
                    return;
                }

                resolve(foundUser);

            }, 1000);

        });

    }

    getByCredentials(un: string, pw: string): Promise<User>{

        return new Promise<User>((resolve, reject) => {

            if(!isValidString(un, pw)){
                reject(new InvalidInputError('Valid string was not input'));
                return;
            }

            setTimeout(() => {

                let foundUser = {...userData.filter(user => user.username === un && user.password === pw).pop() as User};

                if(Object.keys(foundUser).length === 0){
                    reject(new AuthenticationError('Invalid credentials'));
                    return;
                }

                resolve(foundUser);

            },1000);

        });

    }

}