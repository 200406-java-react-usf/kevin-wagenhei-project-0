import {CrudRepository} from './crud-repo';
import {Card} from '../models/cards';
import cardData from '../data/card-db';
import {isValidId,isValidObject,isValidString} from '../util/validator';
import {ResourceNotFoundError, InvalidInputError, ResourceConflictError} from '../errors/errors';

export class CardRepository implements CrudRepository<Card>{

    private static instance: CardRepository;

    private constructor() {}

    static getInstance(){
        return !CardRepository.instance ? CardRepository.instance = new CardRepository : CardRepository.instance;
    }

    getAll(): Promise<Card[]>{

        return new Promise((resolve,reject) =>{

            setTimeout(()=> {

                let card: Card[] = [];

                for (let cards of cardData){
                    card.push({...cards});
                }

                if (card.length == 0){
                    reject(new ResourceNotFoundError('No Cards Found in Database'));
                    return; 
                }

                resolve(card);

            },1000);

        });

    }

    getById(id: number): Promise<Card>{

        return new Promise<Card>((resolve, reject) => {

            if(!isValidId(id)){
                reject(new InvalidInputError('Invalid ID was input'));
                return;
            }

            setTimeout(() => {

                const card: Card = {...cardData.filter(card => card.id === id).pop() as Card};

                if (Object.keys(card).length === 0){
                    reject(new ResourceNotFoundError('Card with that ID does not exist'));
                    return;
                }

                resolve(card);

            }, 1000);

        });

    }

    save(newCard: Card): Promise<Card>{

        return new Promise<Card>((resolve, reject) => {

            if(!isValidObject(newCard, 'id') || !isValidId(newCard.id)){
                reject(new InvalidInputError('Valid card object was not input'));
                return;
            }

            setTimeout(() => {

                let nameConflict = cardData.filter(card => card.name == newCard.name);

                if(nameConflict.length !== 0){
                    reject(new ResourceConflictError('Card Already Exists In Database'));
                    return;

                }

                newCard.id = (cardData.length) + 1;
                cardData.push(newCard);
                resolve(newCard);

            },1000);

        });

    }

    //*** NEED TO SEE WHY I CANT CALL THIS METHOD, THEN GET ALL TO SEE THE UPDATED CARD *** 
    update(updatedCard: Card): Promise<Card>{

        return new Promise<Card>((resolve, reject) => {

            if (!isValidId(updatedCard.id) || !isValidObject(updatedCard, 'id')){
                reject(new InvalidInputError('Valid Card object/ID was not input'));
                return;
            }

            setTimeout(() => {

                let cardToBeUpdated = cardData.find(card => card.id === updatedCard.id);

                if(!cardToBeUpdated){
                    reject(new ResourceNotFoundError('Card you want to update does not exist'));
                    return;
                }

                if(cardToBeUpdated.name !== updatedCard.name || cardToBeUpdated.rarity !== updatedCard.rarity){
                    reject(new ResourceConflictError('Cannot update card name or rarity'));
                    return;
                }

                cardToBeUpdated = updatedCard;
                resolve(cardToBeUpdated);

            },1000);

        });

    }

    deleteById(id: number): Promise<boolean>{

        return new Promise<boolean>((resolve,reject) => {



        });

    }

    getByRarity(inputRarity: string): Promise<Card[]>{

        return new Promise((resolve,reject) => {

            if(!isValidString(inputRarity)){
                reject(new InvalidInputError('Valid string was not input'));
                return;
            }

            setTimeout(() => {

                let rarityArray: Card[] = [];

                for (let card of cardData){
                    if(card.rarity == inputRarity){
                        rarityArray.push(card);
                    }
                }

                if(rarityArray.length === 0){
                    reject(new ResourceNotFoundError('Rarity does not Exist'));
                }

                resolve(rarityArray);

            }, 1000);

        });

    }

    getByName(inputName: string): Promise<Card>{

        return new Promise<Card>((resolve, reject) => {

            if(!isValidString(inputName)){
                reject(new InvalidInputError('Valid string was not input'));
                return;
            }

            setTimeout(() => {

                for(let card of cardData){

                    if(card.name == inputName){
                        resolve(card);
                        return;
                    }
    
                }

                reject(new ResourceNotFoundError('Card with that name does not exist'));

            },1000);

        });

    }

}