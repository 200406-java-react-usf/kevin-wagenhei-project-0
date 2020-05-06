import {CrudRepository} from './crud-repo';
import {Card} from '../models/cards';
import {InternalServerError} from '../errors/errors';
import { PoolClient} from 'pg';
import { connectionPool } from '..';
import {mapCardResultSet} from '../util/result-set-mapper';

export class CardRepository implements CrudRepository<Card>{

    /** 
     * Retrieves an Array of Cards from the database
    */

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

    /**
     * Retrieves a Card given an ID
     * @param id {string} id : Unique number given to each card for Identification
     */

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

    /**
     * Retrives a Card from the database given a correct Key/Value pair.
     * @param key {string} The key in the Card Object
     * @param val {string} The value from the respective Key
     */

    async getCardByUniqueKey(key: string, val: string): Promise<Card> {

        let client: PoolClient;

        if(key === 'name') {key = 'card_name';}
        if(key === 'deckWinrate') {key = 'deck_winrate';}
        if(key === 'playedWinrate') {key = 'played_winrate';}

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

    /**
     * Adds a new card to the database
     * @param newCard {Card} Card object
     */

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

    /**
     * Takes in a new card object to update an existing card in the database. Uses ID to find the existing card, and changes the values in the existing object.
     * @param updatedCard {Card} Card Object with the new values you want to update
     */

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

    /**
     * Deletes a Card in the database. Finds the card to delete by ID
     * @param id {number} Unique ID of the card being deleted
     */

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

    /**
     * Returns an array of cards that match the Rarity given in the input.
     * @param inputRarity {string} Rarity you are searching for.
     */

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

    /**
     * Finds a Card based on the name.
     * @param inputName {string} The name of the Card.
     */

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