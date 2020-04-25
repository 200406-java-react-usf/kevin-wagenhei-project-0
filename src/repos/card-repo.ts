import {CrudRepository} from './crud-repo';
import {Card} from '../models/cards';
import cardData from '../data/card-db';

export class CardRepository implements CrudRepository<Card>{

    private static instance: CardRepository;

    private constructor() {}

    static getInstance(){
        return !CardRepository.instance ? CardRepository.instance = new CardRepository : CardRepository.instance;
    }

    getAll(): Promise<Card[]>{

        return new Promise((resolve,reject) =>{

            let card: Card[] = [];

            for (let cards of cardData){
                card.push({...cards})
            }

            if (card.length == 0){
                // *** NEED TO MAKE CUSTOM ERRORS ***
                reject(new Error('No Cards Found in Database'));
                return; 
            }

            resolve(card);

        });

    }

    getById(id: number): Promise<Card>{

        return new Promise<Card>((reject, resolve) => {



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