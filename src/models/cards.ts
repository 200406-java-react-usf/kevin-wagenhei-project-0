export class Card {

    id: number;
    name: string;
    rarity: string;
    deckWinrate: number; //win rate of the decks this card is in
    playedWinrate: number; //win rate of the decks when this card has been played

    constructor(id: number, name: string, rarity: string, dwr: number, pwr: number){

        this.id = id;
        this.name = name;
        this.rarity = rarity;
        this.deckWinrate = dwr;
        this.playedWinrate = pwr;

    }


}