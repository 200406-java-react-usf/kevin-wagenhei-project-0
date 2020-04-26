import {CrudRepository} from './crud-repo';
import {Deck} from '../models/decks';
import deckData from '../data/deck-db';
import {isValidString, isValidObject, isValidId} from '../util/validator';
import {ResourceNotFoundError, InvalidInputError, ResourceConflictError} from '../errors/errors';

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
                    reject(new ResourceNotFoundError('No decks in the database'));
                    return;
                }

                resolve(decks);

            }, 1000);

        });

    }

    getById(id: number): Promise<Deck>{

        return new Promise<Deck>((resolve, reject) => {

            if(!isValidId(id)){
                reject(new InvalidInputError('Valid ID was not input'));
                return;
            }

            setTimeout(() => {

                let foundDeck: Deck = {...deckData.filter(deck => deck.deckId === id).pop() as Deck};

                if (Object.keys(foundDeck).length === 0){
                    reject(new ResourceNotFoundError('No deck found with that ID'));
                    return;
                }

                resolve(foundDeck);

            }, 1000);

        });

    }

    save(newDeck: Deck): Promise<Deck>{

        return new Promise<Deck>((resolve, reject) => {

            if(!isValidObject(newDeck, 'deckId')){
                reject(new InvalidInputError('Valid Object was not input'));
                return;
            }

            setTimeout(() =>{

                let conflict = deckData.filter(deck => deck.authorId === newDeck.authorId && deck.deckname === newDeck.deckname);

                if(conflict.length !== 0){
                    reject(new ResourceConflictError('One author cannot make two decks with the same name'));
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
                reject(new InvalidInputError('Valid deck object was not input'));
                return;
            }

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

}