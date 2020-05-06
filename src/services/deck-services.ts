import {DeckRepository} from '../repos/deck-repo';
import {Deck} from '../models/decks';
import {
    isValidId, 
    isValidString,
    isValidObject,
    isEmptyObject
} from '../util/validator';
import {
    ResourceNotFoundError,
    ResourceConflictError,
    InvalidInputError
} from '../errors/errors';

export class DeckService {

    constructor(private deckRepo: DeckRepository){
        this.deckRepo = deckRepo;
    }

    /**
     * Returns an Array of all Decks in the database.
     */

    async getAllDecks(): Promise<Deck[]> {
            
        let result = await this.deckRepo.getAll();

        if (result.length === 0){
            throw new ResourceNotFoundError('No decks in the database');
        }

        return result;
    
    }

    /**
     * Returns a Deck Array of all the cards in a deck given an ID.
     * @param id {number} Unique number given to each Deck when created.
     */

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

    /**
     * Adds a new Deck to the Database given a Deck Object
     * @param newDeck {Deck} Deck object
     */

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

    /**
     * Checks for duplicate names of decks made by the same author
     * @param authorId {number} Author ID
     * @param name {string} Name of the deck
     */

    async checkForDuplicateNames(authorId: number, name: string): Promise<boolean>{

        try{
            await this.deckRepo.getByAuthorIdAndName(authorId, name);
        }catch (e){
            return true;
        }

        return false;

    }

    /**
     * Takes in a new Deck object to update an existing card in the database. Uses ID to find the existing deck, and changes the values in the existing object.
     * @param updateDeck {Deck} Deck Object 
     */

    async updateDeck(updateDeck: Deck): Promise<Deck>{

        try{

            if(!isValidId(updateDeck.deckId) || !isValidObject(updateDeck, 'id')){
                throw new InvalidInputError('Valid deck object was not input');
            }

            let decktoUpdate = await this.getDeckById(updateDeck.deckId);

            if(!decktoUpdate){
                throw new ResourceNotFoundError('No deck found to update');
            }

            let deckConflict = this.checkForDuplicateNames(updateDeck.authorId,updateDeck.deckname);

            //NEED TO ADD MAPPING TO MAKE THIS WORK
            // if(decktoUpdate[0].deckname === updateDeck.deckname){
            //     deckConflict = true;
            // }

            if(!deckConflict){
                throw new ResourceNotFoundError('One of your decks already has that name');
            }

            let persistedDeck = await this.deckRepo.update(updateDeck);

            return persistedDeck;

        } catch (e){
            throw e;
        }

    }

    /**
     * Finds a deck given its name from parameters.
     * @param name {string} Name of the deck. 
     */

    async getDeckByName(name: string): Promise<Deck[]>{

        if (!isValidString(name)){
            throw new InvalidInputError('Valid string was not input');
        }

        let deck = await this.deckRepo.getByName(name);

        if(!isEmptyObject(deck)){
            throw new ResourceNotFoundError('Deck with that name was not found.');
        }

        return deck;

    }

    /**
     * Finds all decks from one author given their authorID
     * @param id {number} the authorID
     */

    async getDeckByAuthorId(id: number): Promise<Deck[]>{

        if(!isValidId(id)){
            throw new InvalidInputError('Valid ID was not input');
        }

        let deck = await this.deckRepo.getByAuthorId(id);

        if(!isEmptyObject(deck)){
            throw new ResourceNotFoundError();
        }

        return deck;

    }

    /**
     * Deletes a deck given the JSON object from the DELETE HTTP request
     * @param jsonObj {Object} JSON object from the DELETE HTTP request
     */

    async deleteDeck(jsonObj: Object): Promise<boolean>{

        let keys = Object.keys(jsonObj);
        let val = keys[0];

        let deckID = +jsonObj[val];

        if(!isValidId(deckID)){
            throw new InvalidInputError('Invalid ID was input');
        }

        let deckToDelete = await this.getDeckById(deckID);

        if(!deckToDelete){
            throw new ResourceNotFoundError('Deck does not exist or was already deleted');
        }

        let persistedDeck = await this.deckRepo.deleteById(deckID);

        return persistedDeck;

    }

}