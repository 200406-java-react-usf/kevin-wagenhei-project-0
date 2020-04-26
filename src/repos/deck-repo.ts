import {CrudRepository} from './crud-repo';
import {Deck} from '../models/decks';
import deckData from '../data/deck-db';
import {isValidString, isValidObject, isValidId} from '../util/validator';

export class DeckRepository implements CrudRepository<Deck>{

    private static instance: DeckRepository;

    constructor () {}

    static getInstance(){
        return !DeckRepository.instance ? DeckRepository.instance = new DeckRepository() : DeckRepository.instance;
    }

    getAll(): Promise<Deck[]>{

        return new Promise<Deck[]>((resolve,reject) => {

            setTimeout(() => {

                let decks: Deck[] = [];

                for (let deck of deckData){
                    decks.push({...deck});
                }

                if (decks.length === 0){
                    // *** NEED TO MAKE CUSTOM ERRORS ***
                    reject(new Error('no decks in database'));
                    return;
                }

                resolve(decks);

            }, 1000);

        });

    }

    getById(id: number): Promise<Deck>{

        return new Promise<Deck>((resolve, reject) => {

            if(!isValidId(id)){
                // *** NEED TO MAKE CUSTOM ERRORS ***
                reject(new Error('Id is not valid'));
                return;
            }

            setTimeout(() => {

                let foundDeck: Deck = {...deckData.filter(deck => deck.deckId === id).pop() as Deck};

                if (Object.keys(foundDeck).length === 0){
                    // *** NEED TO MAKE CUSTOM ERRORS ***
                    reject(new Error('No deck found with that ID'));
                    return;
                }

                resolve(foundDeck);

            }, 1000);

        });

    }

    save(newDeck: Deck): Promise<Deck>{

        return new Promise<Deck>((resolve, reject) => {

            if(!isValidObject(newDeck, 'deckId')){
                // *** NEED TO MAKE CUSTOM ERRORS ***
                reject(new Error('not a valid object passed in'));
                return;
            }

            setTimeout(() =>{

                let conflict = deckData.filter(deck => deck.authorId === newDeck.authorId && deck.deckname === newDeck.deckname);

                if(conflict.length !== 0){
                    // *** NEED TO MAKE CUSTOM ERRORS ***
                    reject(new Error('One author cannot make 2 decks with the same name'));
                    return;
                }

                newDeck.deckId = (deckData.length) + 1;
                deckData.push(newDeck);
                resolve(newDeck);  

            }, 1000);

        });

    }

    update(updatedDeck: Deck): Promise<Deck>{

        return new Promise<Deck>((resolve,reject) => {

            if(!isValidId(updatedDeck.deckId) || !isValidObject(updatedDeck, 'id')){
                // *** NEED TO MAKE CUSTOM ERRORS ***
                reject(new Error('Deck object is not valid'));
                return;
            }

            setTimeout(() => {

                let deckToUpdate = deckData.find(deck => deck.deckId === updatedDeck.deckId);

                if (!deckToUpdate){
                    // *** NEED TO MAKE CUSTOM ERRORS ***
                    reject(new Error('Deck you are trying to update does not exist'));
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

}