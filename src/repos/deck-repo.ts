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

    save(newDeck: Deck): Promise<Deck>{

        return new Promise<Deck>((resolve, reject) => {

            setTimeout(() =>{

                newDeck.deckId = (deckData.length) + 1;
                deckData.push(newDeck);
                resolve(newDeck);  

            }, 1000);

        });

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

}