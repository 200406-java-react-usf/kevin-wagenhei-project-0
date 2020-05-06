import {UserSchema, CardSchema} from './schemas';
import {User} from '../models/users';
import { Card } from '../models/cards';

/**
 * Maps the values retrieved from the database to a User Object
 * @param resultSet {UserSchema} Schema used in mapping
 */

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

/**
 * Maps the values retrieved from the database to a Card Object
 * @param resultSet {CardSchema} Schema used in mapping
 */

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