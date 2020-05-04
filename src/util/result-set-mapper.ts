import {UserSchema, CardSchema} from './schemas';
import {User} from '../models/users';
import { Card } from '../models/cards';

export function mapUserResultSet(resultSet: UserSchema): User{

    if(!resultSet){
        return {} as User;
    }

    return new User(

        resultSet.id,
        resultSet.username,
        resultSet.first_name,
        resultSet.last_name,
        resultSet.email,
        resultSet.password

    );

}

export function mapCardResultSet(resultSet: CardSchema){

    if(!resultSet){
        return {} as Card;
    }

    return new Card(

        resultSet.id,
        resultSet.card_name,
        resultSet.rarity,
        resultSet.deck_winrate,
        resultSet.played_winrate

    );

}