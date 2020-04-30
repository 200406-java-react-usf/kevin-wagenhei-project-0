import {CrudRepository} from './crud-repo';
import {Card} from '../models/cards';
import cardData from '../data/card-db';
import {ResourceNotFoundError, ResourceConflictError} from '../errors/errors';

export class CardRepository implements CrudRepository<Card>{

    getAll(): Promise<Card[]>{

        return new Promise((resolve) =>{

            setTimeout(()=> {

                let card: Card[] = cardData;
                resolve(card);

            },1000);

        });

    }

    getById(id: number): Promise<Card>{

        return new Promise<Card>((resolve) => {

            setTimeout(() => {

                const card: Card = {...cardData.find(card => card.id === id)};
                resolve(card);

            }, 1000);

        });

    }

    getCardByUniqueKey(key: string, val: string): Promise<Card> {

        return new Promise<Card>((resolve) => {

            setTimeout(() => {

                const card = {...cardData.find(card => card[key] === val)};
                resolve(card);

            }, 1000);

        });

    }

    save(newCard: Card): Promise<Card>{

        return new Promise<Card>((resolve) => {

            setTimeout(() => {

                newCard.id = (cardData.length) + 1;
                cardData.push(newCard);
                resolve(newCard);

            },1000);

        });

    }

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

        return new Promise((resolve) => {

            setTimeout(() => {

                let rarityArray = cardData.filter(card => card.rarity === inputRarity);
                resolve(rarityArray);

            }, 1000);

        });

    }

    getByName(inputName: string): Promise<Card>{

        return new Promise<Card>((resolve) => {

            setTimeout(() => {

                let card = {...cardData.find(card => card.name === inputName)};
                resolve(card);

            },1000);

        });

    }

}