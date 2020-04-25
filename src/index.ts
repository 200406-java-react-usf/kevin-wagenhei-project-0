import {CardRepository} from './repos/card-repo';

(async function(){

    let cardRepo = CardRepository.getInstance();

    console.log(await cardRepo.getAll());

})();