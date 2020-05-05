import {DeckService} from '../services/deck-services';
import {DeckRepository} from '../repos/deck-repo';
import {Deck} from '../models/decks';
import Validator from '../util/validator';
import {ResourceNotFoundError, InvalidInputError, AuthenticationError, ResourceConflictError, InternalServerError} from '../errors/errors';


jest.mock('../repos/deck-repo', () => {

    return new class CardRepository{
        getAll = jest.fn();
        getById = jest.fn();
        save = jest.fn();
        update = jest.fn();
        deleteById = jest.fn();
        getByName = jest.fn();
        getByAuthorId = jest.fn();
        getByAuthorIdAndName = jest.fn();
    }

});

describe('tests for the card Service', () => {

    let sut: DeckService;
    let mockRepo;

    let mockDecks = [
        new Deck(1, 1, 'Kevin\'s Deck', [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]),
        new Deck(2, 3, 'Nick\'s Deck', [30,29,28,27,26,25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1]),
        new Deck(3, 2, 'John\'s Deck', [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,30,29,28,27,26,25,24,23,22,21,19,18,17,16])
    ];

    beforeEach(() => {

        mockRepo = jest.fn(() => {  
            return {
                getAll: jest.fn(),
                getById: jest.fn(),
                save: jest.fn(),
                update: jest.fn(),
                deleteById: jest.fn(),
                getByName: jest.fn(),
                getByAuthorId: jest.fn(),
                getByAuthorIdAndName: jest.fn()
            }
        });

        sut = new DeckService(mockRepo);

    });

    test('should return a Deck[] when getAllDeck is called', async () => {

        //Arrange
        expect.hasAssertions();
        mockRepo.getAll = jest.fn().mockReturnValue(mockDecks);

        //Act
        let result = await sut.getAllDecks();

        //Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(3);

    });

    test('should return a ResourceNotFoundError when getAllDecks is called and db is empty', async () => {

        //Arrange
        expect.assertions(1);
        mockRepo.getAll = jest.fn().mockReturnValue([]);

        try{
            //Act
            await sut.getAllDecks();
        } catch (e){
            //Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }
        
    });

    test('should return a deck when getById is called with correct ID', async () => {

        expect.assertions(2);

        Validator.isValidId = jest.fn().mockReturnValue(true);

        mockRepo.getById = jest.fn().mockImplementation((id: number) => {
            return new Promise<Deck>((resolve) => resolve(mockDecks[id-1]));
        });

        let result = await sut.getDeckById(1);

        expect(result).toBeTruthy();
        expect(result instanceof Deck).toBe(true);

    });

    test('should return InvalidInputError when getById is given an invalid id(decimal)', async () => {

        expect.assertions(1);
        mockRepo.getById = jest.fn().mockReturnValue(false);

        try{
            await sut.getDeckById(3.14);
        } catch(e){
            expect(e instanceof InvalidInputError).toBe(true);
        }

    });

    test('should return InvalidInputError when getById is given an invalid id(0)', async () => {

        expect.assertions(1);
        mockRepo.getById = jest.fn().mockReturnValue(false);

        try{
            await sut.getDeckById(0);
        } catch(e){
            expect(e instanceof InvalidInputError).toBe(true);
        }

    });

    test('should return InvalidInputError when getById is given an invalid id(NaN)', async () => {

        expect.assertions(1);
        mockRepo.getById = jest.fn().mockReturnValue(false);

        try{
            await sut.getDeckById(NaN);
        } catch(e){
            expect(e instanceof InvalidInputError).toBe(true);
        }

    });

    test('should return InvalidInputError when getById is given an invalid id(negative)', async () => {

        expect.assertions(1);
        mockRepo.getById = jest.fn().mockReturnValue(false);

        try{
            await sut.getDeckById(-1);
        } catch(e){
            expect(e instanceof InvalidInputError).toBe(true);
        }

    });

    test('should return InvalidInputError when getById is given an id that does not exist in db', async () => {

        expect.assertions(1);
        mockRepo.getById = jest.fn().mockReturnValue(true);

        try{
            await sut.getDeckById(9000);
        } catch(e){
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should return a deck when getByName is called with correct name', async () => {

        expect.assertions(2);

        Validator.isValidString = jest.fn().mockReturnValue(true);

        mockRepo.getByName = jest.fn().mockImplementation((name: string) => {
            return new Promise<Deck>((resolve) => resolve(mockDecks.find(deck => deck.deckname === name)));
        });

        let result = await sut.getDeckByName('John\'s Deck');

        expect(result).toBeTruthy();
        expect(result instanceof Deck).toBe(true);

    });

    test('should return a ResourceNotFoundError when checking for a name that doesnt exist', async () => {

        expect.assertions(1);

        Validator.isValidString = jest.fn().mockReturnValue(true);

        mockRepo.getByName = jest.fn().mockImplementation((name: string) => {
            return new Promise<Deck>((resolve) => resolve(mockDecks.find(deck => deck.deckname === name)));
        });

        try{
            await sut.getDeckByName('Meow');
        }catch(e){
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should return a InvalidInputError when checking for a name that is falsy', async () => {

        expect.assertions(1);

        Validator.isValidString = jest.fn().mockReturnValue(false);

        mockRepo.getByName = jest.fn().mockImplementation((name: string) => {
            return new Promise<Deck>((resolve) => resolve(mockDecks.find(deck => deck.deckname === name)));
        });

        try{
            await sut.getDeckByName('');
        }catch(e){
            expect(e instanceof InvalidInputError).toBe(true);
        }

    });

    test('should return a Deck when getByAuthorID is given valid author ID', async () => {

        expect.assertions(2);

        Validator.isValidString = jest.fn().mockReturnValue(true);

        mockRepo.getByAuthorId = jest.fn().mockImplementation((authorId: number) => {
            return new Promise<Deck>((resolve) => resolve(mockDecks.find(deck => deck.authorId === authorId)));
        });

        let result = await sut.getDeckByAuthorId(3);

        expect(result).toBeTruthy();
        expect(result instanceof Deck).toBe(true);

    });

    test('should return a ResourceNotFoundError when given a authorId that does not exist', async () => {

        expect.assertions(1);

        Validator.isValidString = jest.fn().mockReturnValue(true);

        mockRepo.getByAuthorId = jest.fn().mockImplementation((authorId: number) => {
            return new Promise<Deck>((resolve) => resolve(mockDecks.find(deck => deck.authorId === authorId)));
        });

        try{
            await sut.getDeckByAuthorId(500);
        }catch(e){
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should return a InvalidInput error when given a falsy authorID', async () => {

        expect.assertions(1);

        Validator.isValidString = jest.fn().mockReturnValue(false);

        mockRepo.getByAuthorId = jest.fn().mockImplementation((authorId: number) => {
            return new Promise<Deck>((resolve) => resolve(mockDecks.find(deck => deck.authorId === authorId)));
        });

        try{
            await sut.getDeckByAuthorId(0);
        }catch(e){
            expect(e instanceof InvalidInputError).toBe(true);
        }

    });

    test('should add a new user when addNewCard is given a valid Card Obj', async () => {

        expect.assertions(2);

        Validator.isValidObject = jest.fn().mockReturnValue(true);

        sut.checkForDuplicateNames = jest.fn().mockReturnValue(true);

        mockRepo.save = jest.fn().mockImplementation((newDeck: Deck) => {
            return new Promise<Deck> ((resolve) => {
                mockDecks.push(newDeck);
                resolve(newDeck);
            });
        });

        let result = await sut.addNewDeck(new Deck(4, 4, 'Lou\'s Deck', [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,30,29,28,27,26,25,24,23,22,21,19,18,17,16]));

        expect(result).toBeTruthy();
        expect(mockDecks.length).toBe(4);

    });

    // test('should throw ResourceConflictError when passing in to addNewDeck a deck that has a name that already exists', async () => {

    //     expect.assertions(1);

    //     Validator.isValidObject = jest.fn().mockReturnValue(true);

    //     sut.isCardAlreadyAdded = jest.fn().mockReturnValue(false);

    //     mockRepo.save = jest.fn().mockImplementation((newCard: Card) => {
    //         return new Promise<Card> ((resolve) => {
    //             mockCards.push(newCard);
    //             resolve(newCard);
    //         });
    //     });

    //     try{
    //         await sut.addNewCard(new Card(0,'Blizzard','test', 55.5, 55.5));
    //     } catch (e){
    //         expect(e instanceof ResourceConflictError).toBe(true);
    //     }

    // });

    test('should throw ResourceConflictError when passing in to addNewDeck a falsy name', async () => {

        expect.assertions(1);

        Validator.isValidObject = jest.fn().mockReturnValue(false);

        sut.checkForDuplicateNames = jest.fn().mockReturnValue(true);

        mockRepo.save = jest.fn().mockImplementation((newDeck: Deck) => {
            return new Promise<Deck> ((resolve) => {
                mockDecks.push(newDeck);
                resolve(newDeck);
            });
        });

        try{
            await sut.addNewDeck(new Deck(4, 4, '', [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,30,29,28,27,26,25,24,23,22,21,19,18,17,16]));
        } catch (e){
            expect(e instanceof InvalidInputError).toBe(true);
        }

    });

    test('should update a new Deck when updateDeck is given a correct Deck that exists', async () => {

        expect.assertions(2);

        Validator.isValidId = jest.fn().mockReturnValue(true);
        Validator.isValidObject = jest.fn().mockReturnValue(true);

        sut.getDeckById = jest.fn().mockImplementation((id: number) => {
            return new Promise<Deck> ((resolve) => {
                resolve(mockDecks.find(deck => deck.deckId === id));
            });
        });

        mockRepo.update = jest.fn().mockImplementation((updateDeck: Deck) => {
            return new Promise<Deck> ((resolve) => {
                resolve(updateDeck);
            });
        });

        let result = await sut.updateDeck(new Deck(2, 3, 'Nick\'s Deck', [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,30,29,28,27,26,25,24,23,22,21,19,18,17,16]));

        expect(result).toBeTruthy();
        expect(result.authorId).toBe(3);

    });

    test('should throw a ResourceNotFoundError when given an id to update that doesnt exist', async () => {

        expect.assertions(1);

        Validator.isValidId = jest.fn().mockReturnValue(true);
        Validator.isValidObject = jest.fn().mockReturnValue(true);

        sut.getDeckById = jest.fn().mockImplementation((id: number) => {
            return new Promise<Deck> ((resolve) => {
                resolve(mockDecks.find(deck => deck.deckId === id));
            });
        });

        mockRepo.update = jest.fn().mockImplementation((updateDeck: Deck) => {
            return new Promise<Deck> ((resolve) => {
                resolve(updateDeck);
            });
        });

        try{
            await sut.updateDeck(new Deck(3000, 3, 'Nick\'s Deck', [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,30,29,28,27,26,25,24,23,22,21,19,18,17,16]));
        } catch(e){
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }
    });

    // test('should throw a ResourceConflictError when updating to a deck name that user already has', async () => {

    //     expect.assertions(1);

    //     Validator.isValidId = jest.fn().mockReturnValue(true);
    //     Validator.isValidObject = jest.fn().mockReturnValue(true);

    //     sut.getCardById = jest.fn().mockImplementation((id: number) => {
    //         return new Promise<Card> ((resolve) => {
    //             resolve(mockCards.find(card => card.id === id));
    //         });
    //     });

    //     mockRepo.update = jest.fn().mockImplementation((updateCard: Card) => {
    //         return new Promise<Card> ((resolve) => {
    //             resolve(updateCard);
    //         });
    //     });

    //     try{
    //         await sut.updateCard(new Card(3,'Meow','Rare', 50,50));
    //     } catch(e){
    //         expect(e instanceof ResourceConflictError).toBe(true);
    //     }

    // });

    test('Should throw InvalidInputError when given an invalid ID in the updated Card', async () => {

        expect.assertions(1);

        Validator.isValidId = jest.fn().mockReturnValue(false);
        Validator.isValidObject = jest.fn().mockReturnValue(true);

        sut.getDeckById = jest.fn().mockImplementation((id: number) => {
            return new Promise<Deck> ((resolve) => {
                resolve(mockDecks.find(deck => deck.deckId === id));
            });
        });

        mockRepo.update = jest.fn().mockImplementation((updateDeck: Deck) => {
            return new Promise<Deck> ((resolve) => {
                resolve(updateDeck);
            });
        });

        try{
            await sut.updateDeck(new Deck(-1, 3, 'Nick\'s Deck', [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,30,29,28,27,26,25,24,23,22,21,19,18,17,16]));
        } catch(e){
            expect(e instanceof InvalidInputError).toBe(true);
        }

    });

    test('Should throw InvalidInputError when given an invalid deck object (updated deck name)', async () => {

        expect.assertions(1);

        Validator.isValidId = jest.fn().mockReturnValue(true);
        Validator.isValidObject = jest.fn().mockReturnValue(false);

        sut.getDeckById = jest.fn().mockImplementation((id: number) => {
            return new Promise<Deck> ((resolve) => {
                resolve(mockDecks.find(deck => deck.deckId === id));
            });
        });

        mockRepo.update = jest.fn().mockImplementation((updateDeck: Deck) => {
            return new Promise<Deck> ((resolve) => {
                resolve(updateDeck);
            });
        });

        try{
            await sut.updateDeck(new Deck(2, 3, '', [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,30,29,28,27,26,25,24,23,22,21,19,18,17,16]));
        } catch(e){
            expect(e instanceof InvalidInputError).toBe(true);
        }

    });

    test('should return true when delete Deck is given a valid id of a card to be deleted', async () => {

        expect.assertions(1);

        Validator.isValidId = jest.fn().mockReturnValue(true);

        sut.getDeckById = jest.fn().mockImplementation((id: number) => {
            return new Promise<Deck> ((resolve) => {
                resolve(mockDecks.find(deck => deck.deckId === id));
            });
        });

        mockRepo.deleteById = jest.fn().mockImplementation((id:number) => {
            return new Promise<boolean> ((resolve) => {
                mockDecks = mockDecks.slice(0,id).concat(mockDecks.slice(id+1,mockDecks.length));
                resolve(true);
            });
        });

        let result = await sut.deleteDeck({deckId: 3});

        expect(result).toBe(true);

    });

    test('should return ResourceNotFoundError when id given does not exist', async () => {

        expect.assertions(1);

        Validator.isValidId = jest.fn().mockReturnValue(true);

        sut.getDeckById = jest.fn().mockImplementation((id: number) => {
            return new Promise<Deck> ((resolve) => {
                resolve(mockDecks.find(deck => deck.deckId === id));
            });
        });

        mockRepo.deleteById = jest.fn().mockImplementation((id:number) => {
            return new Promise<boolean> ((resolve) => {
                mockDecks = mockDecks.slice(0,id).concat(mockDecks.slice(id+1,mockDecks.length));
                resolve(true);
            });
        });
        try{
            await sut.deleteDeck({id: 3000});
        } catch(e){
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should return InvalidInputError when id is not a valid ID', async () => {

        expect.assertions(1);

        Validator.isValidId = jest.fn().mockReturnValue(false);

        sut.getDeckById = jest.fn().mockImplementation((id: number) => {
            return new Promise<Deck> ((resolve) => {
                resolve(mockDecks.find(deck => deck.deckId === id));
            });
        });

        mockRepo.deleteById = jest.fn().mockImplementation((id:number) => {
            return new Promise<boolean> ((resolve) => {
                mockDecks = mockDecks.slice(0,id).concat(mockDecks.slice(id+1,mockDecks.length));
                resolve(true);
            });
        });

        try{
            await sut.deleteDeck({id: -1});
        } catch(e){
            expect(e instanceof InvalidInputError).toBe(true);
        }

    });    

});