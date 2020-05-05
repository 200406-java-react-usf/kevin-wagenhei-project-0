import {CrudRepository} from './crud-repo';
import {User} from '../models/users';
import {InternalServerError} from '../errors/errors';
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