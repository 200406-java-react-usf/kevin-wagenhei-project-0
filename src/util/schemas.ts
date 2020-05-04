import { InternalServerError } from "../errors/errors";

export interface UserSchema{

    id: number;
    username: string;
    password: string;
    email: string;
    first_name: string;
    last_name: string;

}

export interface CardSchema{

    id: number;
    card_name: string;
    rarity: string;
    deck_winrate: number;
    played_winrate: number;

}

export interface DeckSchema{



}