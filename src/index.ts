import {CardRepository} from './repos/card-repo';
import { Card } from './models/cards';

// (async function(){

//     let cardRepo = CardRepository.getInstance();

//     console.log(await cardRepo.getAll());

// })();

// (async function(){

//     let cardRepo = CardRepository.getInstance();

//     console.log(await cardRepo.getById(11));

// })();

(async function(){

    let cardRepo = CardRepository.getInstance();

    let newCard = new Card(1, 'Knife Juggler', 'Rare', 1.3, 1.8, 47.8, 21000, 43.1);

    console.log(await cardRepo.save(newCard));

})();