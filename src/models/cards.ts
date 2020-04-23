export class Card {

    id: number;
    name: string;
    rarity: string;
    percentInDecks: number; //percentage of decks the card is in
    copiesInDecks: number; //how many copies people use in their decks
    deckWinRate: number; //win rate of the decks this card is in
    timesPlayed: number; //the amount of times this card has been played (rounded to nearest thousand)
    playedWinRate: number; //win rate of the decks when this card has been played

    constructor(id: number, name: string, rarity: string, pid: number, cid: number, dwr: number, tp: number, pwr: number){

        this.id = id;
        this.name = name;
        this.rarity = rarity; 
        this.percentInDecks = pid;
        this.copiesInDecks = cid;
        this.deckWinRate = dwr;
        this.timesPlayed = tp;
        this.playedWinRate = pwr;

    }


}