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

// (async function(){

//     let cardRepo = CardRepository.getInstance();

//     let newCard = new Card(0, 'Knife Juggler', 'Rare', 1.3, 1.8, 47.8, 21000, 43.1);

//     console.log(await cardRepo.save(newCard));

// })();

// (async function(){

//     let cardRepo = CardRepository.getInstance();

//     let updateCard = new Card(11, 'Alexstraza', 'Legendary', 5, 5, 5, 5, 5);

//     console.log(await cardRepo.update(updateCard));

// })();

// (async function(){

//     let cardRepo = CardRepository.getInstance();

//     console.log(await cardRepo.getByRarity('Legendary'));

// })();

(async function(){

    let cardRepo = CardRepository.getInstance();

    console.log(await cardRepo.getByName('SI:7 Agent'));

})();






