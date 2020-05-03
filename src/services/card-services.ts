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

    async getAllCards(): Promise<Card[]>{

        let result = await this.cardRepo.getAll();

        if(result.length === 0){
            throw new ResourceNotFoundError('No cards found in the database.');
        }

        return result;

    }

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

    getCardByRarity(rarity: string): Promise<Card[]>{

        return new Promise<Card[]>(async (resolve,reject) => {

            if(!isValidString(rarity)){
                reject(new InvalidInputError('Valid string was not input'));
                return;
            }

            let cards = [...await this.cardRepo.getByRarity(rarity)];

            if(cards.length === 0){
                return reject(new ResourceNotFoundError('Rarity does not Exist'));
            }

            resolve(cards);

        });

    }
    
    getCardByName(name: string): Promise<Card>{

        return new Promise<Card>(async (resolve,reject) => {

            if(!isValidString(name)){
                reject(new InvalidInputError('Valid string was not input'));
                return;
            }

            let card = await this.cardRepo.getByName(name);

            if(!isEmptyObject(card)){
                return reject(new ResourceNotFoundError('Card with that name does not exist'));
            }

            resolve(card);

        });

    }

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

    private async isCardAlreadyAdded(name:string): Promise<boolean>{

        try{
            await this.getCardByUniqueKey({'name': name});
        } catch (e){
            return true;
        }

        return false;

    }

    async getCardByUniqueKey(queryObj: any): Promise<Card>{

        try {

            let queryKeys = Object.keys(queryObj);

            if(!queryKeys.every(key => isPropertyOf(key, Card))){
                throw new InvalidInputError();
            }

            let key = queryKeys[0];
            let val = queryObj[key];

            if(key === 'id'){
                throw await this.getCardById(+key);
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

    updateCard(updatedCard: Card): Promise<Card>{

        return new Promise<Card>(async (resolve,reject) => {

            if (!isValidId(updatedCard.id) || !isValidObject(updatedCard, 'id')){
                reject(new InvalidInputError('Valid Card object/ID was not input'));
                return;
            }

            try{
                resolve(await this.cardRepo.update(updatedCard));
            } catch(e) {
                reject(e);
            }

        });

    }

}