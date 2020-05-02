export class Card {

    id: number;
    name: string;
    rarity: string;
    deckWinRate: number; //win rate of the decks this card is in
    playedWinRate: number; //win rate of the decks when this card has been played

    constructor(id: number, name: string, rarity: string, dwr: number, pwr: number){

        this.id = id;
        this.name = name;
        this.rarity = rarity;
        this.deckWinRate = dwr;
        this.playedWinRate = pwr;

    }


}