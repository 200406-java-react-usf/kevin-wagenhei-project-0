import {CardRepository} from '../repos/card-repo';
import {CardService} from '../services/card-services';
import {DeckRepository} from '../repos/deck-repo';
import {DeckService} from '../services/deck-services';
import {UserRepository} from '../repos/user-repo';
import {UserService} from '../services/user-services';

const cardRepo = new CardRepository();
const cardService = new CardService(cardRepo);

const deckRepo = new DeckRepository();
const deckService = new DeckService(deckRepo);

const userRepo = new UserRepository();
const userService = new UserService(userRepo);

export default {
    cardService,
    deckService,
    userService
};