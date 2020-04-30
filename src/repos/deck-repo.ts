import {CrudRepository} from './crud-repo';
import {Deck} from '../models/decks';
import deckData from '../data/deck-db';
import {isValidString, isValidObject, isValidId} from '../util/validator';
import {ResourceNotFoundError, InvalidInputError, ResourceConflictError} from '../errors/errors';

export class DeckRepository implements CrudRepository<Deck>{

    getAll(): Promise<Deck[]>{

        return new Promise<Deck[]>((resolve,reject) => {

            setTimeout(() => {

                let decks: Deck[] = deckData;

                resolve(decks);

            }, 1000);

        });

    }

    getById(id: number): Promise<Deck>{

        return new Promise<Deck>((resolve, reject) => {

            setTimeout(() => {

                let foundDeck: Deck = {...deckData.find(deck => deck.deckId === id)};
                resolve(foundDeck);

            }, 1000);

        });

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