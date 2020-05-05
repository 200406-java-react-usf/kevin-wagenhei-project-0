import {CrudRepository} from './crud-repo';
import {Card} from '../models/cards';
import cardData from '../data/card-db';
import {ResourceNotFoundError, ResourceConflictError, InternalServerError} from '../errors/errors';
import { PoolClient} from 'pg';
import { connectionPool } from '..';
import {mapCardResultSet} from '../util/result-set-mapper';

export class CardRepository implements CrudRepository<Card>{

    async getAll(): Promise<Card[]>{

        let client: PoolClient;

        try{
            client = await connectionPool.connect();
            let sql = 'select * from cards';
            let rs = await client.query(sql);
            return rs.rows.map(mapCardResultSet);
        }catch(e){
            throw new InternalServerError;
        } finally{
            client && client.release();
        }

    }

    async getById(id: number): Promise<Card>{

        let client: PoolClient;

        try{
            client = await connectionPool.connect();
            let sql = `select * from cards where id = $1`;
            let rs = await client.query(sql, [id]);
            return mapCardResultSet(rs.rows[0]);
        } catch(e){
            throw new InternalServerError();
        }

    }

    async getCardByUniqueKey(key: string, val: string): Promise<Card> {

        let client: PoolClient;

        if(key === 'name') {key = 'card_name'};
        if(key === 'deckWinrate') {key = 'deck_winrate'};
        if(key === 'playedWinrate') {key = 'played_winrate'};

        try{
            client = await connectionPool.connect();
            let sql = `select * from cards where ${key} = $1`;
            let rs = await client.query(sql,[val]);
            return mapCardResultSet(rs.rows[0]);
        } catch(e){
            throw new InternalServerError();
        } finally{
            client && client.release();
        }

    }

    async save(newCard: Card): Promise<Card>{

        let client: PoolClient;

        try{
            client = await connectionPool.connect();

            let sql = `insert into cards (card_name, rarity, deck_winrate, played_winrate) values ($1, $2, $3, $4)`;

            await client.query(sql, [newCard.name,newCard.rarity,newCard.deckWinrate,newCard.playedWinrate]);

            let sqlId = `select * from cards where card_name = $1`;

            let rs = await client.query(sqlId, [newCard.name]);

            newCard.id = rs.rows[0].id;

            return newCard;

        } catch(e){
            throw new InternalServerError();
        } finally{
            client && client.release();
        }

    }

    async update(updatedCard: Card): Promise<Card>{

        let client: PoolClient;

        try{
            client = await connectionPool.connect();

            let sql = `
                update cards
                    set
                        deck_winrate = $2,
                        played_winrate = $3
                    where id = $1    
            `;

            await client.query(sql, [updatedCard.id,updatedCard.deckWinrate, updatedCard.playedWinrate]);

            return updatedCard;

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
            let sql = `delete from cards where id = $1`;
            await client.query(sql, [id]);
            return true;
        } catch(e){
            throw new InternalServerError();
        } finally{
            client && client.release();
        }

    }

    async getByRarity(inputRarity: string): Promise<Card[]>{

        let client: PoolClient;

        try{
            client = await connectionPool.connect();
            let sql = 'select * from cards where rarity = $1';
            let rs = await client.query(sql, [inputRarity]);
            return rs.rows.map(mapCardResultSet);
        } catch (e){
            throw new InternalServerError();
        } finally{
            client && client.release();
        }

    }

    async getByName(inputName: string): Promise<Card>{

        let client: PoolClient;

        try{
            client = await connectionPool.connect();
            let sql = 'select * from cards where card_name = $1';
            let rs = await client.query(sql, [inputName]);
            return mapCardResultSet(rs.rows[0]);
        } catch (e){
            throw new InternalServerError();
        } finally{
            client && client.release();
        }

    }

}