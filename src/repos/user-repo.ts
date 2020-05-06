import {CrudRepository} from './crud-repo';
import {User} from '../models/users';
import {InternalServerError} from '../errors/errors';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import {mapUserResultSet} from '../util/result-set-mapper';

export class UserRepository implements CrudRepository<User> {

    /**
     * Retrieves all Users in the database.
     */

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

    /**
     * Retrives a User given their unique ID
     * @param id {number} Unique ID given to a user when created
     */

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

    /**
     * Retrieves a user given a key in the user object, and its value
     * @param key {string} Key in the User object
     * @param val {string} Value based on the given key
     */

    async getUserByUniqueKey(key: string, val: string): Promise<User> {

        let client: PoolClient;        
        
        if (key === 'firstName') {key = 'first_name';}
        if (key === 'lastName') {key = 'last_name';}

        try{
            client = await connectionPool.connect();
            let sql = `select * from app_users where ${key} = $1`;
            let rs = await client.query(sql, [val]);
            return mapUserResultSet(rs.rows[0]);
        } catch(e){
            throw new InternalServerError();
        } finally{
            client && client.release();
        }

    }

    /**
     * Adds a new User to the database.
     * @param newUser {User} User Object
     */

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

            let sqlId = `select * from app_users where username = $1`;

            let rs = await client.query(sqlId, [newUser.username]);

            newUser.id = rs.rows[0].id;

            return newUser;

        }catch (e){
            throw new InternalServerError();
        } finally{
            client && client.release();
        }

    }

    /**
     * Updates an existing user based on the values given in the user passed in. Uses ID to find and update the existing user.
     * @param updatedUser {User} User Object
     */

    async update(updatedUser: User): Promise<User>{

        let client: PoolClient;

        try{
            client = await connectionPool.connect();
            let sql = `
                update app_users 
                    set 
                        username = $2, 
                        first_name = $3, 
                        last_name = $4,
                        email = $5,
                        password = $6
                    where id = $1      
            `;
            await client.query(sql, [updatedUser.id, updatedUser.username, updatedUser.firstName, updatedUser.lastName, updatedUser.email, updatedUser.password]);
            return updatedUser;

        } catch(e){
            throw new InternalServerError();
        } finally{
            client && client.release();
        }

    }

    /**
     * Deletes a user given its unique ID
     * @param id {number} Unique ID of the user
     */

    async deleteById(id: number): Promise<boolean>{

        let client: PoolClient;

        try{
            client = await connectionPool.connect();
            let sql = `delete from app_users where id = $1;`;
            await client.query(sql, [id]);
            return true;
        } catch (e){
            throw new InternalServerError();
        } finally{
            client && client.release();
        }

    }

    /**
     * Retrieves a user given the username of the user.
     * @param un {string} Username of the User
     */

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

    /**
     * Retrieves a user given the user's username and password
     * @param un {string} Username
     * @param pw {string} Password
     */

    async getByCredentials(un: string, pw: string): Promise<User>{

        let client: PoolClient;

        try{
            client = await connectionPool.connect();
            let sql = 'select * from app_users where username = $1 and password = $2';
            let rs = await client.query(sql, [un, pw]);
            return mapUserResultSet(rs.rows[0]);
        } catch(e){
            throw new InternalServerError();
        } finally{
            client && client.release();
        }

    }

}