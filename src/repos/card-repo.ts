import {CrudRepository} from './crud-repo';
import {Card} from '../models/cards';
import cardData from '../data/card-db';
import {isValidId,isValidObject} from '../util/validator';

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
                    // *** NEED TO MAKE CUSTOM ERRORS ***
                    reject(new Error('No Cards Found in Database'));
                    return; 
                }

                resolve(card);

            },1000);

        });

    }

    getById(id: number): Promise<Card>{

        return new Promise<Card>((resolve, reject) => {

            if(!isValidId(id)){
                // *** NEED TO MAKE CUSTOM ERRORS ***
                reject(new Error('Not Valid Id'));
                return
            }

            setTimeout(() => {

                const card: Card = {...cardData.filter(card => card.id === id).pop() as Card};

                if (Object.keys(card).length === 0){
                    // *** NEED TO MAKE CUSTOM ERRORS ***
                    reject(new Error('card doesnt exsist'));
                    return;
                }

                resolve(card);

            }, 1000);

        });

    }

    save(newCard: Card): Promise<Card>{

        return new Promise<Card>((resolve, reject) => {

            if(!isValidObject(newCard, 'id')){
                // *** NEED TO MAKE CUSTOM ERRORS ***
                reject(new Error('Not a valid Object'));
                return;
            }

            setTimeout(() => {

                let nameConflict = cardData.filter(card => card.name == newCard.name)

                if(nameConflict.length !== 0){
                    // *** NEED TO MAKE CUSTOM ERRORS ***
                    reject(new Error('Card Already Exists In Database'));
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
                // *** NEED TO MAKE CUSTOM ERRORS ***
                reject(new Error('Not a valid object/ID'))
                return;
            }

            setTimeout(() => {

                let cardToBeUpdated = cardData.find(card => card.id === updatedCard.id);

                if(!cardToBeUpdated){
                    // *** NEED TO MAKE CUSTOM ERRORS ***
                    reject(new Error('Card you want to update does not exist'));
                    return;
                }

                if(cardToBeUpdated.name !== updatedCard.name || cardToBeUpdated.rarity !== updatedCard.rarity){
                    // *** NEED TO MAKE CUSTOM ERRORS ***
                    reject(new Error('Cannot update card name or rarity'));
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

}