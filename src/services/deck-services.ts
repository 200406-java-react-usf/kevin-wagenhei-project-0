import {DeckRepository} from '../repos/deck-repo';
import {Deck} from '../models/decks';
import {
    isValidId, 
    isValidString,
    isValidObject,
    isEmptyObject,
    isPropertyOf
} from '../util/validator';
import {
    ResourceNotFoundError,
    AuthenticationError,
    ResourceConflictError,
    InvalidInputError,
    AuthorizationError
} from '../errors/errors';
import deckData from '../data/deck-db';

export class DeckService {

    constructor(private deckRepo: DeckRepository){
        this.deckRepo = deckRepo;
    }

    getAllDecks(): Promise<Deck[]> {

        return new Promise<Deck[]>(async (resolve,reject) => {
            
            let result = await this.deckRepo.getAll();

            if (result.length === 0){
                reject(new ResourceNotFoundError('No decks in the database'));
                return;
            }

            resolve(result);

        });
    }

    getDeckById(id: number): Promise<Deck> {

        return new Promise<Deck>(async (resolve,reject) => {

            if(!isValidId(id)){
                reject(new InvalidInputError('Valid ID was not input'));
                return;
            }

            let deck = {...await this.deckRepo.getById(id)};

            if (!isEmptyObject(deck)){
                reject(new ResourceNotFoundError('No deck found with that ID'));
                return;
            }

            resolve(deck);

        });

    }

    addNewDeck(newDeck: Deck): Promise<Deck> {

        return new Promise<Deck>(async (resolve,reject) => {

            if(!isValidObject(newDeck, 'deckId')){
                reject(new InvalidInputError('Valid Object was not input'));
                return;
            }

            let conflict = deckData.filter(deck => deck.authorId === newDeck.authorId && deck.deckname === newDeck.deckname);

            if(conflict.length !== 0){
                reject(new ResourceConflictError('One author cannot make two decks with the same name'));
                return;
            }

            try{
                const persistedDeck = await this.deckRepo.save(newDeck);
                resolve(persistedDeck);
            } catch (e){
                reject(e);
            }

        });

    }

}