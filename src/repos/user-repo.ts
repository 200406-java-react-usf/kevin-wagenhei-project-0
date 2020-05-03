import {CrudRepository} from './crud-repo';
import {User} from '../models/users';
import userData from '../data/user-db';
import {ResourceNotFoundError, ResourceConflictError, InternalServerError} from '../errors/errors';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import {mapUserResultSet} from '../util/result-set-mapper';

export class UserRepository implements CrudRepository<User> {

    async getAll(): Promise<User[]>{

        let client: PoolClient;

        try{
            client = await connectionPool.connect();
            let sql = 'select * from app_users';
            let rs = await client.query(sql);
            return rs.rows.map(mapUserResultSet);
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
            return mapUserResultSet(rs.rows[0]);
        } catch (e){
            throw new InternalServerError();
        } finally{
            client && client.release();
        }

    }

     async getUserByUniqueKey(key: string, val: string): Promise<User> {

        let client: PoolClient;        
        
        if (key === 'firstName') {key = 'first_name'};
        if (key === 'lastName') {key = 'last_name'};

        try{
            client = await connectionPool.connect();
            let sql = `select * from app_users where ${key} = $1`
            let rs = await client.query(sql, [val]);
            return mapUserResultSet(rs.rows[0]);
        } catch(e){
            throw new InternalServerError();
        } finally{
            client && client.release();
        }

    }

    async save(newUser: User): Promise<User>{

        let client: PoolClient;

        try{
            client = await connectionPool.connect();

            let sql = `
                insert into app_users (username, password, email, first_name, last_name)
                values
                    ($1, $2, $3, $4, $5);
            `;

            await client.query(sql, [newUser.username, newUser.password, newUser.email, newUser.firstName, newUser.lastName]);

            let sqlId = `select * from app_users where username = $1`

            let rs = await client.query(sqlId, [newUser.username]);

            newUser.id = rs.rows[0].id

            return newUser;

        }catch (e){
                throw new InternalServerError();
        } finally{
            client && client.release();
        }

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

    async getByUsername(un: string): Promise<User>{

        let client: PoolClient;

        try{
            client = await connectionPool.connect();
            let sql = 'select * from app_users where username = $1';
            let rs = await client.query(sql, [un]);
            return mapUserResultSet(rs.rows[0]);
        } catch (e){
            new InternalServerError();
        } finally{
            client && client.release();
        }

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