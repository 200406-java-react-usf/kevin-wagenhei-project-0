import {DeckRepository} from '../repos/deck-repo';
import * as mockIndex from '..';
import {Deck} from '../models/decks';
import {InternalServerError} from '../errors/errors';

//Mock Connection Pool
jest.mock('..', () => {
    return {
        connectionPool: {
            connect: jest.fn()
        }
    };
});

describe('testing for userRepo', () => {

    let sut = new DeckRepository();
    let mockConnect = mockIndex.connectionPool.connect;

    beforeEach(() =>{
        (mockConnect as jest.Mock).mockClear().mockImplementation(() =>{
            return {
                query: jest.fn().mockImplementation(() => {
                    return {

                        rows: [

                            {
                                id: 1,
                                author_id: 2,
                                deck_name: 'Mock Deck',
                                card_name: 'Mock Card'
                            }
                        ]
                    };
                }),
                release: jest.fn()
            };
        });
    });

    test('should resolve to an array of Decks when getAll is called', async () => {

        //Arrange
        expect.hasAssertions();
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { 
                    return {rows: [[1, 2, 'Mock Deck', 'Mock Card']]};}),
                release: jest.fn()
            };
        });

        //Act
        let result = await sut.getAll();

        //Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(1);
        expect(mockConnect).toBeCalledTimes(1);

    });

    test('should return an empty array when get all is called with no data in the db', async () => {

        //Arrange
        expect.hasAssertions();
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return {rows: []};}),
                release: jest.fn()
            };
        });

        //Act
        let result = await sut.getAll();

        //Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(0);
        expect(mockConnect).toBeCalledTimes(1);

    });

    test('should return a Deck Array when getById gets a Deck from the db', async () => {

        //Arrange
        expect.hasAssertions();

        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { 
                    return {rows: [[1, 2, 'Mock Deck', 'Mock Card']]};}),
                release: jest.fn()
            };
        });

        //Act
        let result = await sut.getById(1);

        //Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBeTruthy();        

    });

    test('should return InternalServerError when getbyId does not find a user with specified ID', async () => {

        expect.hasAssertions();

        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    return;
                }),
                release: jest.fn()
            };
        });

        try{
            await sut.getById(3);
        } catch(e){
            expect(e instanceof InternalServerError).toBe(true);
        }

    });
    
    test('should return a new Deck Object when save adds a new Deck to the db', async () => {

        //Arrange
        expect.hasAssertions();

        let mockDeck = new Deck(2, 3, 'Nick\'s Deck', [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,30,29,28,27,26,25,24,23,22,21,19,18,17,16]);
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockReturnValueOnce(true).mockResolvedValueOnce(true),
                release: jest.fn()
            };
        });

        sut.getByAuthorIdAndName = jest.fn().mockReturnValue(2);

        //Act
        let result = await sut.save(mockDeck);

        //Assert
        expect(result).toBeTruthy();
        expect(result instanceof Deck).toBeTruthy();        

    });

    test('should return InternalServerError when save runs into an error adding to the db', async () => {

        expect.hasAssertions();

        let mockDeck = new Deck(2, 3, 'Nick\'s Deck', [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,30,29,28,27,26,25,24,23,22,21,19,18,17,16]);
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    throw new Error();
                }),
                release: jest.fn()
            };
        });

        try{
            await sut.save(mockDeck);
        } catch(e){
            expect(e instanceof InternalServerError).toBe(true);
        }

    });

    test('should return the updated Deck when update is given a valid Deck to update', async() => {

        expect.hasAssertions();

        let mockDeck = new Deck(2, 3, 'Nick\'s Deck', [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,30,29,28,27,26,25,24,23,22,21,19,18,17,16]);
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    return mockDeck;
                }),
                release: jest.fn()
            };
        });

        let result = await sut.update(mockDeck);

        expect(result).toBeTruthy();
        expect(result instanceof Deck).toBe(true);

    });

    test('should return InternalServerError when update is given a invalid Deck to update', async() => {

        expect.hasAssertions();

        let mockDeck = new Deck(2, 3, '', [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,30,29,28,27,26,25,24,23,22,21,19,18,17,16]);
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    throw new Error();
                }),
                release: jest.fn()
            };
        });

        try{
            await sut.update(mockDeck);
        } catch (e){
            expect(e instanceof InternalServerError).toBe(true);
        }

    });

    test('should return true when deleteById is given a valid id to delete', async() => {

        expect.hasAssertions();

        let mockDeck = new Deck(2, 3, '', [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,30,29,28,27,26,25,24,23,22,21,19,18,17,16]);
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    return true;
                }),
                release: jest.fn()
            };
        });

        let result = await sut.deleteById(mockDeck.deckId);

        expect(result).toBeTruthy();
        expect(result).toBe(true);

    });

    test('should return InternalServerError when deleteById fails to delete a deck', async() => {

        expect.hasAssertions();

        let mockDeck = new Deck(2, 3, '', [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,30,29,28,27,26,25,24,23,22,21,19,18,17,16]);
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    throw new Error;
                }),
                release: jest.fn()
            };
        });

        try{
            await sut.deleteById(mockDeck.deckId);
        } catch(e){
            expect( e instanceof InternalServerError).toBe(true);
        }

    });

    test('should return a Deck Array when getByName is given a valid ID', async() => {

        expect.hasAssertions();

        let mockDeck = new Deck(2, 3, 'Nick\'s Deck', [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,30,29,28,27,26,25,24,23,22,21,19,18,17,16]);
        
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { 
                    return {rows: [[1, 2, 'Mock Deck', 'Mock Card']]};}),
                release: jest.fn()
            };
        });

        let result = await sut.getByName(mockDeck.deckname);

        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);

    });

    test('should return a InternalServerError when a deck cant be found in the db', async() => {

        expect.hasAssertions();

        let mockDeck = new Deck(2, 3, '', [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,30,29,28,27,26,25,24,23,22,21,19,18,17,16]);
        
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { 
                    return;                        
                }),
                release: jest.fn()
            };
        });
        try{
            await sut.getByName(mockDeck.deckname);
        } catch(e){
            expect(e instanceof InternalServerError).toBe(true);
        }

    });

    test('should return a Deck Array when getByAuthorId is given a valid authorID', async() => {

        expect.hasAssertions();
        
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { 
                    return {rows: [[1, 2, 'Mock Deck', 'Mock Card']]};}),
                release: jest.fn()
            };
        });

        let result = await sut.getByAuthorId(3);

        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);

    });

    test('should return InternalServerError when getByAuthorId cant find a deck in db', async() => {

        expect.hasAssertions();
        
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { 
                    return;                        
                }),
                release: jest.fn()
            };
        });
        try{
            await sut.getByAuthorId(3);
        } catch(e){
            expect(e instanceof InternalServerError).toBe(true);
        }

    });

    test('should return an id for a deck when getByAuthorIdAName is given valid authorId and name', async() => {

        expect.hasAssertions();
        
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { 
                    return 2; }),
                release: jest.fn()
            };
        });

        let result = await sut.getByAuthorIdAndName(3, 'Nick\'s Deck');

        expect(result).toBeTruthy();
        expect(result).toBe(2);

    });

});

