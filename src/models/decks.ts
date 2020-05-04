import {Card} from './cards';

export class Deck{

    deckId: number;
    authorId: number
    deckname: string;
    deckArray: number[];

    constructor(id:number, authorId: number, name:string, da: number[]){

        this.deckId = id;
        this.authorId = authorId;
        this.deckname = name;
        this.deckArray = da;

    }

} 