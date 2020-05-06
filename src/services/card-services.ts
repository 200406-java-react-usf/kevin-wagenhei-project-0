import {Card} from '../models/cards';
import {CardRepository} from '../repos/card-repo';
import {
    isValidId, 
    isValidString,
    isValidObject,
    isEmptyObject,
    isPropertyOf
} from '../util/validator';
import {
    ResourceNotFoundError,
    ResourceConflictError,
    InvalidInputError
} from '../errors/errors';

export class CardService {

    constructor(private cardRepo: CardRepository) {
        this.cardRepo = cardRepo;
    }

    /** 
     * Retrieves an Array of Cards from the database
    */

    async getAllCards(): Promise<Card[]>{

        let result = await this.cardRepo.getAll();

        if(result.length === 0){
            throw new ResourceNotFoundError('No cards found in the database.');
        }

        return result;

    }

    /**
     * Retrieves a Card given an ID
     * @param id {string} id : Unique number given to each card for Identification
     */

    async getCardById(id: number): Promise<Card> {        

        if(!isValidId(id)){
            throw new InvalidInputError('Invalid ID was input');
        }

        let card = await this.cardRepo.getById(id);

        if (!isEmptyObject(card)){
            throw new ResourceNotFoundError('Card with that ID does not exist');
        }

        return card;

    }

    /**
     * Returns an array of cards that match the Rarity given in the input.
     * @param rarity {string} Rarity you are searching for.
     */

    async getCardByRarity(rarity: string): Promise<Card[]>{

        if(!isValidString(rarity)){
            throw new InvalidInputError('Valid string was not input');
        }

        let cards = await this.cardRepo.getByRarity(rarity);

        if(cards.length === 0){
            throw new ResourceNotFoundError('Rarity does not Exist');
        }

        return cards;

    }

    /**
     * Finds a Card based on the name.
     * @param name {string} The name of the Card.
     */
    
    async getCardByName(name: string): Promise<Card>{

        if(!isValidString(name)){
            throw new InvalidInputError('Valid string was not input');
        }

        let card = await this.cardRepo.getByName(name);

        if(!isEmptyObject(card)){
            throw new ResourceNotFoundError('Card with that name does not exist');
        }

        return card;

    }

    /**
     * Adds a new card to the database
     * @param newCard {Card} Card object
     */

    async addNewCard(newCard: Card): Promise<Card>{

        try{
            
            if(!isValidObject(newCard, 'id')){
                throw new InvalidInputError('Valid card object was not input');
            }
            
            let nameConflict = await this.isCardAlreadyAdded(newCard.name);

            if(!nameConflict){
                throw new ResourceConflictError('Card Already Exists In Database');
            }
            
            const persistedCard = await this.cardRepo.save(newCard);
            return persistedCard;
        
        } catch (e){

            throw e;

        }    
            
    }

    /**
     * Checks if the function exists in the database
     * @param name {string} Name of the card
     */

    async isCardAlreadyAdded(name:string): Promise<boolean>{

        try{
            await this.getCardByUniqueKey({'name': name});
        } catch (e){
            return true;
        }

        return false;

    }

    /**
     * Retrives a Card from the database given a correct Key/Value pair.
     * @param queryObj {any} Object with the key and value to search for 
     */

    async getCardByUniqueKey(queryObj: any): Promise<Card>{

        try {

            let queryKeys = Object.keys(queryObj);

            if(!queryKeys.every(key => isPropertyOf(key, Card))){
                throw new InvalidInputError();
            }

            let key = queryKeys[0];
            let val = queryObj[key];

            if(key === 'id'){
                return await this.getCardById(val);
            }

            if(!isValidString(val)){
                throw new InvalidInputError();
            }

            let card = await this.cardRepo.getCardByUniqueKey(key, val);

            if(!isEmptyObject(card)){
                throw new ResourceNotFoundError();
            }

            return card;

        } catch (e) {

            throw e;

        }

    }

    /**
     * Takes in a new card object to update an existing card in the database. Uses ID to find the existing card, and changes the values in the existing object.
     * @param updatedCard {Card} Card Object with the new values you want to update
     */

    async updateCard(updatedCard: Card): Promise<Card>{

        try{

            if (!isValidId(updatedCard.id) || !isValidObject(updatedCard, 'id')){
                throw new InvalidInputError('Valid Card object/ID was not input');
            }

            let cardToUpdate = await this.getCardById(updatedCard.id);

            if(!cardToUpdate){
                throw new ResourceNotFoundError('No card found to update');
            }

            if(updatedCard.name !== cardToUpdate.name){
                throw new ResourceConflictError('Cannot update card name');
            }

            if(updatedCard.rarity !== cardToUpdate.rarity){
                throw new ResourceConflictError('Cannot update card rarity');
            }

            let persistedCard = await this.cardRepo.update(updatedCard);

            return persistedCard;

        } catch(e){
            throw e;
        }

    }

    /**
     * Deletes a card given the JSON object from the DELETE HTTP request
     * @param jsonObj {Object} JSON object from the DELETE HTTP request
     */

    async deleteCard(jsonObj: Object): Promise<boolean>{

        let keys = Object.keys(jsonObj);
        let val = keys[0];

        let cardID = +jsonObj[val];

        if(!isValidId(cardID)){
            throw new InvalidInputError('Invalid ID was input');
        }

        let cardToDelete = await this.getCardById(cardID);

        if(!cardToDelete){
            throw new ResourceNotFoundError('Card does not exist, or was already deleted');
        }

        let persistedCard = await this.cardRepo.deleteById(cardID);

        return persistedCard;

    }

}