import {CrudRepository} from './crud-repo';
import {Card} from '../models/cards';
import cardData from '../data/card-db';
import {isValidId,isValidObject,isValidString} from '../util/validator';
import {ResourceNotFoundError, InvalidInputError, ResourceConflictError} from '../errors/errors';

export class CardRepository implements CrudRepository<Card>{

    getAll(): Promise<Card[]>{

        return new Promise((resolve,reject) =>{

            setTimeout(()=> {

                let card: Card[] = cardData;
                resolve(card);

            },1000);

        });

    }

    getById(id: number): Promise<Card>{

        return new Promise<Card>((resolve, reject) => {

            setTimeout(() => {

                const card: Card = {...cardData.find(card => card.id === id)};
                resolve(card);

            }, 1000);

        });

    }

    save(newCard: Card): Promise<Card>{

        return new Promise<Card>((resolve, reject) => {

            setTimeout(() => {

                newCard.id = (cardData.length) + 1;
                cardData.push(newCard);
                resolve(newCard);

            },1000);

        });

    }

    //*** NEED TO SEE WHY I CANT CALL THIS METHOD, THEN GET ALL TO SEE THE UPDATED CARD *** 
    update(updatedCard: Card): Promise<Card>{

        return new Promise<Card>((resolve, reject) => {

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

            setTimeout(() => {

                let rarityArray: Card[] = cardData.filter(card => card.rarity === inputRarity);
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