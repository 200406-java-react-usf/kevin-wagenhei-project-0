import {CardRepository} from '../repos/card-repo';
import {CardService} from '../services/card-services';
import {DeckRepository} from '../repos/deck-repo';
import {DeckService} from '../services/deck-services';

const cardRepo = new CardRepository();
const cardService = new CardService(cardRepo);

const deckRepo = new DeckRepository();
const deckService = new DeckService(deckRepo);

export default {
    cardService,
    deckService
};