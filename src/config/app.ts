import {CardRepository} from '../repos/card-repo';
import {CardService} from '../services/card-services';

const cardRepo = new CardRepository();
const cardService = new CardService(cardRepo);

export default {
    cardService
};