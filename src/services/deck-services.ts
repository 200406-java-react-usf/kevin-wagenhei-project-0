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

    async getAllDecks(): Promise<Deck[]> {
            
        let result = await this.deckRepo.getAll();

        if (result.length === 0){
            throw new ResourceNotFoundError('No decks in the database');
        }

        return result;
    
    }

    async getDeckById(id: number): Promise<Deck[]> {

        if(!isValidId(id)){
            throw new InvalidInputError('Valid ID was not input');
        }

        let deck = await this.deckRepo.getById(id);

        if (!isEmptyObject(deck)){
            throw new ResourceNotFoundError('No deck found with that ID');
        }

        return deck;

    }

    async addNewDeck(newDeck: Deck): Promise<Deck> {

        try{

            if(!isValidObject(newDeck, 'deckId')){
                throw new InvalidInputError('Valid Object was not input');
            }

            let conflict = await this.checkForDuplicateNames(newDeck.authorId, newDeck.deckname);

            if(!conflict){
                throw new ResourceConflictError('One author cannot make two decks with the same name');
            }

            const persistedDeck = await this.deckRepo.save(newDeck);

            return persistedDeck;

        } catch(e){
            
            throw e;

        }    

    }

    private async checkForDuplicateNames(authorId: number, name: string): Promise<boolean>{

        try{
            await this.deckRepo.getByAuthorIdAndName(authorId, name);
        }catch (e){
            return true;
        }

        return false;

    }

    updateDeck(updateDeck: Deck): Promise<Deck>{

        return new Promise<Deck> (async (resolve,reject) => {

            if(!isValidId(updateDeck.deckId) || !isValidObject(updateDeck, 'id')){
                reject(new InvalidInputError('Valid deck object was not input'));
                return;
            }

            try{
                resolve(await this.deckRepo.save(updateDeck));
            } catch(e){
                reject(e);
            }

        });

    }

    getDeckByName(name: string): Promise<Deck>{

        return new Promise<Deck>(async(resolve,reject) => {

            if (!isValidString(name)){
                reject(new InvalidInputError('Valid string was not input'));
                return;
            }

            let deck = await this.deckRepo.getByName(name);

            if(!isEmptyObject(deck)){
                return reject(new ResourceNotFoundError('Deck with that name was not found.'))
            }

            resolve(deck);

        });

    }

    getDeckByAuthorId(id: number): Promise<Deck[]>{

        return new Promise<Deck[]>(async (resolve,reject) => {

            if(!isValidId(id)){
                reject(new InvalidInputError('Valid ID was not input'));
                return;
            }

            let deck = await this.deckRepo.getByAuthorId(id);

            if(!isEmptyObject(deck)){
                return reject(new ResourceNotFoundError);
            }

            resolve(deck);

        });

    }

}