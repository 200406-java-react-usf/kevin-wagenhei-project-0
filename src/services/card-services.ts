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
    AuthenticationError,
    ResourceConflictError,
    InvalidInputError,
    AuthorizationError
} from '../errors/errors';
import cardData from '../data/card-db';

export class CardService {

    constructor(private cardRepo: CardRepository) {
        this.cardRepo = cardRepo;
    }

    getAllCards(): Promise<Card[]>{

        return new Promise<Card[]>( async (resolve,reject) => {

            let cards: Card[] = [];
            let result = await this.cardRepo.getAll();

            for (let card of result){
                cards.push({...card});
            }

            if(cards.length === 0){
                return reject(new ResourceNotFoundError('No cards found in the database.'));
            }

            resolve(cards);

        });


    }

    getCardById(id: number): Promise<Card> {

        return new Promise<Card>(async (resolve,reject) => {

            if(!isValidId(id)){
                return reject(new InvalidInputError('Invalid ID was input'));
            }

            let card = {... await this.cardRepo.getById(id)};

            if (!isEmptyObject(card)){
                reject(new ResourceNotFoundError('Card with that ID does not exist'));
                return;
            }

            resolve(card);

        });

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

            if(!card){
                return reject(new ResourceNotFoundError('Card with that name does not exist'));
            }

            resolve(card);

        });

    }

    addNewCard(newCard: Card): Promise<Card>{

        return new Promise<Card>(async(resolve,reject) => {

            if(!isValidObject(newCard, 'id')){
                return reject(new InvalidInputError('Valid card object was not input'));
            }

            //GET BY UNIQUE KEY
            let nameConflict = cardData.filter(card => card.name == newCard.name);

            if(nameConflict.length !== 0){
                reject(new ResourceConflictError('Card Already Exists In Database'));
                return;

            }

            // why does this need to be a try catch block if there is no reject on save()?

            try{
                const persistedCard = await this.cardRepo.save(newCard);
                resolve(persistedCard);
            } catch (e){
                reject(e);
            }

        });

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