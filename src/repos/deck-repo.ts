import {Deck} from '../models/decks';
import {InternalServerError} from '../errors/errors';
import {PoolClient} from 'pg';
import {connectionPool} from '..';


export class DeckRepository{

    baseSql = `
        select
            de.id,
            de.author_id,
            de.deck_name,
            ca.card_name
        from decks de
        join deck_card dc
        on de.id = dc.deck_id
        join cards ca
        on ca.id = dc.card_id
    `;

    /**
     * Returns an Array of all Decks in the database.
     */

    async getAll(): Promise<Deck[]>{

        let client: PoolClient;
        
        try{
            client = await connectionPool.connect();
            let sql = `${this.baseSql}`;
            let rs = await client.query(sql);
            return rs.rows;
        } catch (e){
            throw new InternalServerError();
        } finally{
            client && client.release();
        }

    }

    /**
     * Returns a Deck Array of all the cards in a deck given an ID.
     * @param id {number} Unique number given to each Deck when created.
     */

    async getById(id: number): Promise<Deck[]>{

        let client: PoolClient;

        try{
            client = await connectionPool.connect();
            let sql = `${this.baseSql} where de.id = $1`;
            let rs = await client.query(sql, [id]);
            return rs.rows;
        } catch(e){
            throw new InternalServerError();
        } finally{
            client && client.release();
        }

    }

    /**
     * Adds a new Deck to the Database given a Deck Object
     * @param newDeck {Deck} Deck object
     */

    async save(newDeck: Deck): Promise<Deck>{

        let client: PoolClient;

        try{
            client = await connectionPool.connect();
            let sqlOne = `
                insert into decks (author_id, deck_name)
                values
                    ($1, $2);
            `;
            await client.query(sqlOne, [newDeck.authorId, newDeck.deckname]);

            let rsTwo = await this.getByAuthorIdAndName(newDeck.authorId, newDeck.deckname);

            let sqlTwo = `
                insert into deck_card (deck_id, card_id)
                values
                    ($1, $2);
            `; 
            for (let i = 0; i < newDeck.deckArray.length; i++){
                await client.query(sqlTwo, [rsTwo, newDeck.deckArray[i]]);
            }

            newDeck.deckId = rsTwo;

            return newDeck;

        } catch(e){
            throw new InternalServerError();
        } finally{
            client && client.release();
        }

    }

    /**
     * Takes in a new Deck object to update an existing card in the database. Uses ID to find the existing deck, and changes the values in the existing object.
     * @param updatedDeck {Deck} Deck Object 
     */

    async update(updatedDeck: Deck): Promise<Deck>{

        let client: PoolClient;

        try{

            client = await connectionPool.connect();
            let sqlOne = `
                update decks
                    set
                        deck_name = $2
                where id = $1;        
            `;
            await client.query(sqlOne, [updatedDeck.deckId, updatedDeck.deckname]);

            let sqlTwo = `delete from deck_card where deck_id = $1;`;

            await client.query(sqlTwo, [updatedDeck.deckId]);

            let sqlThree = `
                insert into deck_card (deck_id, card_id)
                values
                    ($1, $2);
            `;
            for (let i = 0; i < updatedDeck.deckArray.length; i++){
                await client.query(sqlThree, [updatedDeck.deckId, updatedDeck.deckArray[i]]);
            }

            return updatedDeck;

        } catch(e){
            throw new InternalServerError();
        } finally{
            client && client.release();
        }

    }

    /**
     * Deletes a Deck in the database. Finds the deck to delete by ID
     * @param id {number} Unique ID of the deck being deleted
     */

    async deleteById(id: number): Promise<boolean>{

        let client: PoolClient;

        try{
            client = await connectionPool.connect();
            let sqlOne = 'delete from deck_card where deck_id = $1';
            await client.query(sqlOne, [id]);
            let sqlTwo = 'delete from decks where id = $1';
            await client.query(sqlTwo, [id]);
            return true;
        } catch(e){
            throw new InternalServerError();
        } finally{
            client && client.release();
        }

    }

    /**
     * Finds a deck given its name from parameters.
     * @param input {string} Name of the deck. 
     */

    async getByName(input: string): Promise<Deck[]>{

        let client: PoolClient;

        try{
            client = await connectionPool.connect();
            let sql = `${this.baseSql} where deck_name = $1`;
            let rs = await client.query(sql, [input]);
            return rs.rows;
        } catch(e){
            throw new InternalServerError();
        } finally{
            client && client.release();
        }

    }

    /**
     * Finds all decks from one author given their authorID
     * @param id {number} the authorID
     */

    async getByAuthorId(id: number): Promise<Deck[]>{         

        let client: PoolClient;

        try{
            client = await connectionPool.connect();
            let sql = `${this.baseSql} where author_id = $1`;
            let rs = await client.query(sql, [id]);
            return rs.rows;
        } catch(e){
            throw new InternalServerError();
        } finally{
            client && client.release();
        }

    }

    /**
     * Finds a deck based on the ID and the Author ID
     * @param authorId {number} Author ID
     * @param deckName {string} Name of the deck
     */

    async getByAuthorIdAndName(authorId: number, deckName: string): Promise<number>{

        let client: PoolClient;

        try{
            client = await connectionPool.connect();
            let sql = `select id from decks where author_id = $1 and deck_name = $2`;
            let rs = await client.query(sql, [authorId,deckName]);
            return rs.rows[0].id;
        } catch (e){
            throw new InternalServerError();
        } finally{
            client && client.release();
        }

    }

}