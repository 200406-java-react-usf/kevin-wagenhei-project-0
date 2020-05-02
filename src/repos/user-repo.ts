import {CrudRepository} from './crud-repo';
import {User} from '../models/users';
import userData from '../data/user-db';
import {ResourceNotFoundError, ResourceConflictError, InternalServerError} from '../errors/errors';
import { PoolClient } from 'pg';
import { connectionPool } from '..';

export class UserRepository implements CrudRepository<User> {

    async getAll(): Promise<User[]>{

        let client: PoolClient;

        try{
            client = await connectionPool.connect();
            let sql = 'select * from app_users';
            let rs = await client.query(sql);
            return rs.rows;
        } catch(e){
            throw new InternalServerError();
        } finally{
            client && client.release();
        }

    }

    async getById(id: number): Promise<User>{

        let client: PoolClient;

        try{
            client = await connectionPool.connect();
            let sql = 'select * from app_users where id = $1';
            let rs = await client.query(sql, [id]);
            return rs.rows[0];
        } catch (e){
            throw new InternalServerError();
        } finally{
            client && client.release();
        }

    }

    getUserByUniqueKey(key: string, val: string): Promise<User> {

        return new Promise<User>((resolve) => {

            setTimeout(() => {

                const user = {...userData.find(user => user[key] === val)};
                resolve(user);

            }, 1000);

        });

    }

    save(newUser: User): Promise<User>{

        return new Promise<User> ((resolve) => {

            setTimeout(() => {

                newUser.id = (userData.length) + 1;
                userData.push(newUser);
                resolve(newUser);

            },1000);

        });

    }

    update(updatedUser: User): Promise<User>{

        return new Promise<User>((resolve, reject) => {

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

        return new Promise<User>((resolve) => {

            setTimeout(() => {

                let foundUser = {...userData.find(user => user.username === un)};
                resolve(foundUser);

            }, 1000);

        });

    }

    getByCredentials(un: string, pw: string): Promise<User>{

        return new Promise<User>((resolve) => {

            setTimeout(() => {

                let foundUser = {...userData.find(user => user.username === un && user.password === pw)};
                resolve(foundUser);

            },1000);

        });

    }

}