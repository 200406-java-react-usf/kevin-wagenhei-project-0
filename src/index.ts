import {CardRepository} from './repos/card-repo';
import { Card } from './models/cards';
import {UserRepository} from './repos/user-repo';
import {User} from './models/users';

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

// (async function(){

//     let cardRepo = CardRepository.getInstance();

//     console.log(await cardRepo.getByName('SI:7 Agent'));

// })();

// (async function(){

//     let userRepo = UserRepository.getInstance();

//     console.log(await userRepo.getAll());

// })();

// (async function(){

//     let userRepo = UserRepository.getInstance();

//     console.log(await userRepo.getById(3));

// })();

// (async function(){

//     let userRepo = UserRepository.getInstance();

//     let newUser = new User(0, 'aaliantro', 'Anthony Aliantro', 'aaliantro@gmail.com', 'password');

//     console.log(await userRepo.save(newUser));

// })();

(async function(){

    let userRepo = UserRepository.getInstance();

    let updatedUser = new User(1, 'Wagenheim', 'update', 'update@update.com', 'update');

    console.log(await userRepo.update(updatedUser));

})();


