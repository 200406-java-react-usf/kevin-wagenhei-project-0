import {CrudRepository} from './crud-repo';
import {User} from '../models/users';
import userData from '../data/user-db';
import {isValidString, isValidObject, isValidId} from '../util/validator';

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
                    // *** NEED TO MAKE CUSTOM ERRORS ***
                    reject(new Error('No users in Database'));
                    return;
                }

                resolve(users);

            },1000);

        });

    }

    getById(id: number): Promise<User>{

        return new Promise<User>((resolve,reject) => {

            if(!isValidId(id)){
                // *** NEED TO MAKE CUSTOM ERRORS ***
                reject(new Error('Not a valid Id'));
                return;
            }

            setTimeout(() => {

                const user: User = userData.filter(user => user.id === id).pop() as User;

                if(Object.keys(user).length == 0){
                    // *** NEED TO MAKE CUSTOM ERRORS ***
                    reject(new Error('No user with that ID found'));
                    return;
                }

                resolve(user);

            },1000);

        });

    }

    save(newUser: User): Promise<User>{

        return new Promise<User> ((resolve,reject) => {

            if(!isValidObject(newUser, 'id')){
                // *** NEED TO MAKE CUSTOM ERRORS ***
                reject(new Error('Not a valid Object'));
                return;
            }

            setTimeout(() => {

                let usernameConflict = userData.filter(user => user.username == newUser.username);
                let emailConflict = userData.filter(user => user.email === newUser.email);

                if(usernameConflict.length !== 0 || emailConflict.length !== 0){
                    // *** NEED TO MAKE CUSTOM ERRORS ***
                    reject(new Error('username or email is already in use'));
                    return;
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
                // *** NEED TO MAKE CUSTOM ERRORS ***
                reject(new Error('Updated user is not a User Object'));
                return;
            }

            setTimeout(() => {

                let userToUpdate = userData.find(user => user.id === updatedUser.id);

                if(!userToUpdate){
                    // *** NEED TO MAKE CUSTOM ERRORS ***
                    reject(new Error('no user found to update'));
                    return;
                }

                if(userToUpdate.username !== updatedUser.username){
                    // *** NEED TO MAKE CUSTOM ERRORS ***
                    reject(new Error('cannot update username'));
                    return;
                }

                const conflict = userData.filter(user => {
                    if(user.id === updatedUser.id){
                        return false;
                    }
                    return user.email == updatedUser.email;
                }).pop();
                
                if(conflict){
                    // *** NEED TO MAKE CUSTOM ERRORS ***
                    reject(new Error('email already exisits in the database'));
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
                // *** NEED TO MAKE CUSTOM ERRORS ***
                reject(new Error('not a valid string'));
                return;
            }

            setTimeout(() => {

                let foundUser = {...userData.filter(user => user.username === un).pop() as User};

                if(Object.keys(foundUser).length === 0){
                    // *** NEED TO MAKE CUSTOM ERRORS ***
                    reject(new Error('No User found'));
                    return;
                }

                resolve(foundUser);

            }, 1000);

        });

    }

    getByCredentials(un: string, pw: string): Promise<User>{

        return new Promise<User>((resolve, reject) => {

            if(!isValidString(un, pw)){
                // *** NEED TO MAKE CUSTOM ERRORS ***
                reject(new Error('not a valid String'));
                return;
            }

            setTimeout(() => {

                let foundUser = {...userData.filter(user => user.username === un && user.password === pw).pop() as User};

                if(Object.keys(foundUser).length === 0){
                    // *** NEED TO MAKE CUSTOM ERRORS ***
                    reject(new Error('No user found with those creds'));
                    return;
                }

                resolve(foundUser);

            },1000);

        });

    }

}