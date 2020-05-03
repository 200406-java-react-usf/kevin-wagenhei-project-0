import {CrudRepository} from './crud-repo';
import {Deck} from '../models/decks';
import deckData from '../data/deck-db';
import {ResourceNotFoundError, InvalidInputError, ResourceConflictError, InternalServerError} from '../errors/errors';
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

    async getById(id: number): Promise<Deck[]>{

        let client: PoolClient;

        try{
            client = await connectionPool.connect();
            let sql = `${this.baseSql} where de.id = $1`;
            let rs = await client.query(sql, [id]);
            return rs.rows;
        } catch(e){
            
        }

    }

    async save(newDeck: Deck): Promise<Deck>{

        let client: PoolClient;

        try{
            client = await connectionPool.connect();
            console.log('add one');
            let sqlOne = `
                insert into decks (author_id, deck_name)
                values
                    ($1, $2);
            `;
            await client.query(sqlOne, [newDeck.authorId, newDeck.deckname]);
            console.log('add two');
            let rsTwo = await this.getByAuthorIdAndName(newDeck.authorId, newDeck.deckname);
            console.log(rsTwo);
            console.log('add THREE');
            let sqlTwo = `
                insert into deck_card (deck_id, card_id)
                values
                    ($1, $2);
            `; 
            for (let i = 0; i < newDeck.deckArray.length; i++){
                await client.query(sqlTwo, [rsTwo, newDeck.deckArray[i]]);
            }

            console.log('FOUR');
            newDeck.deckId = rsTwo;

            return newDeck;

        } catch(e){
            throw new InternalServerError();
        } finally{
            client && client.release();
        }

    }

    update(updatedDeck: Deck): Promise<Deck>{

        return new Promise<Deck>((resolve,reject) => {

            setTimeout(() => {

                let deckToUpdate = deckData.find(deck => deck.deckId === updatedDeck.deckId);

                if (!deckToUpdate){
                    reject(new ResourceNotFoundError('Deck you are trying to update does not exist'));
                    return;
                }

                deckToUpdate = updatedDeck;
                resolve(deckToUpdate);

            }, 1000);

        });

    }

    deleteById(id: number): Promise<boolean>{

        return new Promise<boolean>((resolve, reject) => {



        });

    }

    getByName(input: string): Promise<Deck>{

        return new Promise<Deck>((resolve, reject) => {

            setTimeout(() => {

                let card = {...deckData.find(deck => deck.deckname === input)};
                resolve(card);

            },1000);

        });

    }

    getByAuthorId(id: number): Promise<Deck[]>{
        
        return new Promise<Deck[]>((resolve, reject) => {            

            setTimeout(() => {
                
                let decks = deckData.filter(deck => deck.authorId === id);
                resolve(decks);

            }, 1000);

        });

    }

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