import {CardRepository as sut} from '../repos/card-repo';
import {Card} from '../models/cards';
import {ResourceNotFoundError, ResourceConflictError, InvalidInputError} from '../errors/errors';
import Validator from '../util/validator';
import cardData from '../data/card-db';

/*
describe('Tests for the Card Repository', () => {

    beforeEach(() => {

        Validator.isValidObject = jest.fn().mockImplementation(() => {
            throw new Error('Failed to mock external function isValidObject');
        });

        Validator.isValidString = jest.fn().mockImplementation(() => {
            throw new Error('Failed to mock external function isValidString');
        });

        Validator.isValidId = jest.fn().mockImplementation(() => {
            throw new Error('Failed to mock external function isValidId');
        });

    });

    test('Testing Card Repo for Singleton pattern', () => {

        expect.assertions(1);

        let reference1 = sut.getInstance();
        let reference2 = sut.getInstance();

        expect(reference1).toEqual(reference2);

    });

    test('Should return all cards when get all is card', async () => {

        expect.assertions(2);

        let result = await sut.getInstance().getAll();

        expect(result.length).toBeGreaterThan(0);
        expect(result.length).toEqual(cardData.length);

    });

    test('Should return 3 cards when looking for Legendary cards using get by rarity method', async () => {

        expect.assertions(2);
        Validator.isValidString = jest.fn().mockReturnValue(true);

        let result = await sut.getInstance().getByRarity('Legendary');

        expect(result).toBeTruthy();
        expect(result.length).toEqual(3);

    });

    test('Should return 10 cards when looking for Rare cards using get by rarity method', async () => {

        expect.assertions(2);
        Validator.isValidString = jest.fn().mockReturnValue(true);

        let result = await sut.getInstance().getByRarity('Rare');

        expect(result).toBeTruthy();
        expect(result.length).toEqual(10);

    });

    test('Should return ResourceNotFoundError when given a string thats not a rarity', async () => {

        expect.assertions(1);
        Validator.isValidString = jest.fn().mockReturnValue(true);

        try{
            await sut.getInstance().getByRarity('meow');
        } catch(e){
            expect(e instanceof ResourceNotFoundError).toBeTruthy();
        }

    });

    test('Should return InvalidInputError when given a falsy string', async () => {

        expect.assertions(1);
        Validator.isValidString = jest.fn().mockReturnValue(false);

        try{
            await sut.getInstance().getByRarity('');
        } catch(e){
            expect(e instanceof InvalidInputError).toBeTruthy();
        }

    });

    test('Should return InvalidInputError when given a non-string', async () => {

        expect.assertions(1);
        Validator.isValidString = jest.fn().mockReturnValue(false);

        try{
            await sut.getInstance().getByRarity(null);
        } catch(e){
            expect(e instanceof InvalidInputError).toBeTruthy();
        }

    });

    test('Should return a card when given a valid card that exists', async () => {

        expect.assertions(2);
        Validator.isValidString = jest.fn().mockReturnValue(true);

        let result = await sut.getInstance().getByName('Edwin Vancleef');

        expect(result).toBeTruthy();
        expect(result.id).toBe(7);

    });

    test('Should return ResourceNotFoundError when given a name that doesnt exist', async () => {

        expect.assertions(1);
        Validator.isValidString = jest.fn().mockReturnValue(true);

        try{
            await sut.getInstance().getByName('meow');
        } catch(e){
            expect(e instanceof ResourceNotFoundError).toBeTruthy();
        }

    });

    test('Should return InvalidInputError when given a falsy string', async () => {

        expect.assertions(1);
        Validator.isValidString = jest.fn().mockReturnValue(false);

        try{
            await sut.getInstance().getByName('');
        } catch(e){
            expect(e instanceof InvalidInputError).toBeTruthy();
        }

    });

    test('Should return InvalidInputError when given a falsy value', async () => {

        expect.assertions(1);
        Validator.isValidString = jest.fn().mockReturnValue(false);

        try{
            await sut.getInstance().getByName(null);
        } catch(e){
            expect(e instanceof InvalidInputError).toBeTruthy();
        }

    });

    test('Should return correct user when valid ID is given', async () => {

        expect.assertions(3);
        Validator.isValidId = jest.fn().mockReturnValue(true);

        let result = await sut.getInstance().getById(11);

        expect(result).toBeTruthy();
        expect(result.id).toBe(11);
        expect(result.name).toBe('Alexstraza');

    });

    test('Should throw InvalidInputError when given an invalid ID', async () => {

        expect.assertions(1);
        Validator.isValidId = jest.fn().mockReturnValue(false);

        try{
            await sut.getInstance().getById(-1);
        } catch (e){
            expect(e instanceof InvalidInputError).toBeTruthy();
        }

    });

    test('Should throw ResourceNotFoundError when given an id that doesnt exist', async () => {

        expect.assertions(1);
        Validator.isValidId = jest.fn().mockReturnValue(true);

        try{
            await sut.getInstance().getById(9999);
        } catch(e){
            expect(e instanceof ResourceNotFoundError).toBeTruthy();
        }

    });

    test('Should return a new card with correct ID when save is given a valid new card', async () => {

        expect.assertions(3);
        Validator.isValidObject = jest.fn().mockReturnValue(true);

        let newCard = new Card(0, 'Knife Juggler', 'Rare', 1.3, 1.8, 47.8, 21000, 43.1);
        let result = await sut.getInstance().save(newCard);

        expect(result).toBeTruthy();
        expect(result.id).toEqual(cardData.length);
        expect(result.name).toBe('Knife Juggler');

    });

    test('Should throw InvalidInputError when save is given an invalid object', async () => {

        expect.assertions(1);
        Validator.isValidObject = jest.fn().mockReturnValue(false);

        let newCard = null;
        
        try{
            await sut.getInstance().save(newCard);
        }catch(e){
            expect(e instanceof InvalidInputError).toBeTruthy();
        }
        

    });

    test('Should throw ResourceConflictError when save is given a card that already exists', async () => {

        expect.assertions(1);
        Validator.isValidObject = jest.fn().mockReturnValue(true);

        let newCard = new Card(11, 'Alexstraza', 'Legendary', 1.3, 1.8, 47.8, 21000, 43.1);

        try{
            await sut.getInstance().save(newCard);
        } catch(e){
            expect(e instanceof ResourceConflictError).toBeTruthy();
        }

    });

    test('Should return InvalidInputError when given a new card with a falsy name value', async () => {

        expect.assertions(1);
        Validator.isValidObject = jest.fn().mockReturnValue(false);

        let newCard = new Card(11, '', 'Legendary', 1.3, 1.8, 47.8, 21000, 43.1);

        try{
            await sut.getInstance().save(newCard);
        }catch(e){
            expect(e instanceof InvalidInputError).toBeTruthy();
        }

    });

    test('Should return InvalidInputError when given a new card with a falsy rarity value', async () => {

        expect.assertions(1);
        Validator.isValidObject = jest.fn().mockReturnValue(false);

        let newCard = new Card(0, 'Knife Juggler', '', 1.3, 1.8, 47.8, 21000, 43.1);

        try{
            await sut.getInstance().save(newCard);
        }catch(e){
            expect(e instanceof InvalidInputError).toBeTruthy();
        }

    });

    test('Should return InvalidInputError when given a new card with a falsy percentInDecks value', async () => {

        expect.assertions(1);
        Validator.isValidObject = jest.fn().mockReturnValue(false);

        let newCard = new Card(0, 'Knife Juggler', 'Rare', null, 1.8, 47.8, 21000, 43.1);

        try{
            await sut.getInstance().save(newCard);
        }catch(e){
            expect(e instanceof InvalidInputError).toBeTruthy();
        }

    });

    test('Should return InvalidInputError when given a new card with a falsy copies value', async () => {

        expect.assertions(1);
        Validator.isValidObject = jest.fn().mockReturnValue(false);

        let newCard = new Card(0, 'Knife Juggler', 'Rare', 1.3, null, 47.8, 21000, 43.1);

        try{
            await sut.getInstance().save(newCard);
        }catch(e){
            expect(e instanceof InvalidInputError).toBeTruthy();
        }

    });

    test('Should return InvalidInputError when given a new card with a falsy deckWinRate value', async () => {

        expect.assertions(1);
        Validator.isValidObject = jest.fn().mockReturnValue(false);

        let newCard = new Card(0, 'Knife Juggler', 'Rare', 1.3, 1.8, null, 21000, 43.1);

        try{
            await sut.getInstance().save(newCard);
        }catch(e){
            expect(e instanceof InvalidInputError).toBeTruthy();
        }

    });

    test('Should return InvalidInputError when given a new card with a falsy timesPlayed value', async () => {

        expect.assertions(1);
        Validator.isValidObject = jest.fn().mockReturnValue(false);

        let newCard = new Card(0, 'Knife Juggler', 'Rare', 1.3, 1.8, 47.8, null, 43.1);

        try{
            await sut.getInstance().save(newCard);
        }catch(e){
            expect(e instanceof InvalidInputError).toBeTruthy();
        }

    });

    test('Should return InvalidInputError when given a new card with a falsy timesPlayed value', async () => {

        expect.assertions(1);
        Validator.isValidObject = jest.fn().mockReturnValue(false);

        let newCard = new Card(0, 'Knife Juggler', 'Rare', 1.3, 1.8, 47.8, 21000, null);

        try{
            await sut.getInstance().save(newCard);
        }catch(e){
            expect(e instanceof InvalidInputError).toBeTruthy();
        }

    });

    test('Should return the updated card when a valid card is given to update method', async () => {

        expect.assertions(4);
        Validator.isValidId = jest.fn().mockReturnValue(true);
        Validator.isValidObject = jest.fn().mockReturnValue(true);

        let updateCard = new Card(11, 'Alexstraza', 'Legendary', 5, 5, 5, 5, 5);
        let result = await sut.getInstance().update(updateCard);

        expect(result).toBeTruthy();
        expect(result.name).toBe('Alexstraza');
        expect(result.deckWinRate).toEqual(5);
        expect(result.playedWinRate).toEqual(5);

    });

    test('Should return ResourceNotFoundError when given an updated card has an unknown ID', async () => {

        expect.assertions(1);
        Validator.isValidId = jest.fn().mockReturnValue(true);
        Validator.isValidObject = jest.fn().mockReturnValue(true);

        let updateCard = new Card(99999, 'Alexstraza', 'Legendary', 5, 5, 5, 5, 5);

        try{
            await sut.getInstance().update(updateCard);
        } catch(e){
            expect(e instanceof ResourceNotFoundError).toBeTruthy();
        }

    });

    test('Should return InvalidInputError when given an updated card has an invalid ID(decimal)', async () => {

        expect.assertions(1);
        Validator.isValidId = jest.fn().mockReturnValue(false);
        Validator.isValidObject = jest.fn().mockReturnValue(true);

        let updateCard = new Card(18.5, 'Alexstraza', 'Legendary', 5, 5, 5, 5, 5);

        try{
            await sut.getInstance().update(updateCard);
        } catch(e){
            expect(e instanceof InvalidInputError).toBeTruthy();
        }

    });

    test('Should return InvalidInputError when given an updated card has an invalid ID(negative)', async () => {

        expect.assertions(1);
        Validator.isValidId = jest.fn().mockReturnValue(false);
        Validator.isValidObject = jest.fn().mockReturnValue(true);

        let updateCard = new Card(-1, 'Alexstraza', 'Legendary', 5, 5, 5, 5, 5);

        try{
            await sut.getInstance().update(updateCard);
        } catch(e){
            expect(e instanceof InvalidInputError).toBeTruthy();
        }

    });

    test('Should return ResourceConflictError when given an updated card with a changed name', async () => {

        expect.assertions(1);
        Validator.isValidId = jest.fn().mockReturnValue(true);
        Validator.isValidObject = jest.fn().mockReturnValue(true);

        let updateCard = new Card(11, 'meow', 'Legendary', 5, 5, 5, 5, 5);

        try{
            await sut.getInstance().update(updateCard);
        } catch(e){
            expect(e instanceof ResourceConflictError).toBeTruthy();
        }

    });

    test('Should return ResourceConflictError when given an updated card with a changed rarity', async () => {

        expect.assertions(1);
        Validator.isValidId = jest.fn().mockReturnValue(true);
        Validator.isValidObject = jest.fn().mockReturnValue(true);

        let updateCard = new Card(11, 'Alexstraza', 'meow', 5, 5, 5, 5, 5);

        try{
            await sut.getInstance().update(updateCard);
        } catch(e){
            expect(e instanceof ResourceConflictError).toBeTruthy();
        }

    });

    test('Should return InvalidInputError when given an updated card with a falsy name', async () => {

        expect.assertions(1);
        Validator.isValidId = jest.fn().mockReturnValue(true);
        Validator.isValidObject = jest.fn().mockReturnValue(false);

        let updateCard = new Card(11, '', 'Legendary', 5, 5, 5, 5, 5);

        try{
            await sut.getInstance().update(updateCard);
        } catch(e){
            expect(e instanceof InvalidInputError).toBeTruthy();
        }

    });

    test('Should return InvalidInputError when given an updated card with a falsy rarity', async () => {

        expect.assertions(1);
        Validator.isValidId = jest.fn().mockReturnValue(true);
        Validator.isValidObject = jest.fn().mockReturnValue(false);

        let updateCard = new Card(11, 'Alexstraza', '', 5, 5, 5, 5, 5);

        try{
            await sut.getInstance().update(updateCard);
        } catch(e){
            expect(e instanceof InvalidInputError).toBeTruthy();
        }

    });

    test('Should return InvalidInputError when given an updated card with a falsy percentInDecks', async () => {

        expect.assertions(1);
        Validator.isValidId = jest.fn().mockReturnValue(true);
        Validator.isValidObject = jest.fn().mockReturnValue(false);

        let updateCard = new Card(11, 'Alexstraza', 'Legendary', null, 5, 5, 5, 5);

        try{
            await sut.getInstance().update(updateCard);
        } catch(e){
            expect(e instanceof InvalidInputError).toBeTruthy();
        }

    });

    test('Should return InvalidInputError when given an updated card with a falsy copies value', async () => {

        expect.assertions(1);
        Validator.isValidId = jest.fn().mockReturnValue(true);
        Validator.isValidObject = jest.fn().mockReturnValue(false);

        let updateCard = new Card(11, 'Alexstraza', 'Legendary', 5, null, 5, 5, 5);

        try{
            await sut.getInstance().update(updateCard);
        } catch(e){
            expect(e instanceof InvalidInputError).toBeTruthy();
        }

    });

    test('Should return InvalidInputError when given an updated card with a falsy deckWinRate', async () => {

        expect.assertions(1);
        Validator.isValidId = jest.fn().mockReturnValue(true);
        Validator.isValidObject = jest.fn().mockReturnValue(false);

        let updateCard = new Card(11, 'Alexstraza', 'Legendary', 5, 5, null, 5, 5);

        try{
            await sut.getInstance().update(updateCard);
        } catch(e){
            expect(e instanceof InvalidInputError).toBeTruthy();
        }

    });

    test('Should return InvalidInputError when given an updated card with a falsy timesPlayed value', async () => {

        expect.assertions(1);
        Validator.isValidId = jest.fn().mockReturnValue(true);
        Validator.isValidObject = jest.fn().mockReturnValue(false);

        let updateCard = new Card(11, 'Alexstraza', 'Legendary', 5, 5, 5, null, 5);

        try{
            await sut.getInstance().update(updateCard);
        } catch(e){
            expect(e instanceof InvalidInputError).toBeTruthy();
        }

    });

    test('Should return InvalidInputError when given an updated card with a falsy playedWinRate', async () => {

        expect.assertions(1);
        Validator.isValidId = jest.fn().mockReturnValue(true);
        Validator.isValidObject = jest.fn().mockReturnValue(false);

        let updateCard = new Card(11, 'Alexstraza', 'Legendary', 5, 5, 5, 5, null);

        try{
            await sut.getInstance().update(updateCard);
        } catch(e){
            expect(e instanceof InvalidInputError).toBeTruthy();
        }

    });

});

*/