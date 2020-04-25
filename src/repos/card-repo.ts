import {CrudRepository} from './crud-repo';
import {Card} from '../models/cards';
import cardData from '../data/card-db';
import {isValidId} from '../util/validator';

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



        });

    }

    update(updatedCard: Card): Promise<boolean>{

        return new Promise<boolean>((resolve, reject) => {



        });

    }

    deleteById(id: number): Promise<boolean>{

        return new Promise<boolean>((resolve,reject) => {



        });

    }

}