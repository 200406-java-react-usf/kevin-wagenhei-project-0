import {CardRepository} from '../repos/card-repo';
import * as mockIndex from '..';
import * as mockMapper from '../util/result-set-mapper';
import {Card} from '../models/cards';
import {InternalServerError} from '../errors/errors';

//Mock Connection Pool
jest.mock('..', () => {
    return {
        connectionPool: {
            connect: jest.fn()
        }
    };
});

//Mock result set mapper
jest.mock('../util/result-set-mapper', () => {
    return {
        mapCardResultSet: jest.fn()
    };
});

describe('testing for userRepo', () => {

    let sut = new CardRepository();
    let mockConnect = mockIndex.connectionPool.connect;

    beforeEach(() =>{
        (mockConnect as jest.Mock).mockClear().mockImplementation(() =>{
            return {
                query: jest.fn().mockImplementation(() => {
                    return {

                        rows: [

                            {
                                id: 1,
                                card_name: 'test',
                                rarity: 'test',
                                deck_winrate: 55.5,
                                played_winrate: 55.5
                            }
                        ]
                    };
                }),
                release: jest.fn()
            };
        });
        (mockMapper.mapCardResultSet as jest.Mock).mockClear();
    });

    test('should resolve to an array of Cards when getAll is called', async () => {

        //Arrange
        expect.hasAssertions();

        let mockCard = new Card(1, 'test', 'test', 55.5, 55.5);
        (mockMapper.mapCardResultSet as jest.Mock).mockReturnValue(mockCard);

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

    test('should return a Card Object when getById gets a Card from the db', async () => {

        //Arrange
        expect.hasAssertions();

        let mockCard = new Card(1, 'test', 'test', 55.5, 55.5);
        (mockMapper.mapCardResultSet as jest.Mock).mockReturnValue(mockCard);

        //Act
        let result = await sut.getById(1);

        //Assert
        expect(result).toBeTruthy();
        expect(result instanceof Card).toBeTruthy();        

    });

    test('should return InternalServerError when getbyId does not find a card with specified ID', async () => {

        expect.hasAssertions();

        let mockCard = new Card(1, 'test', 'test', 55.5, 55.5);
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    return false;
                }),
                release: jest.fn()
            };
        });

        try{
            await sut.getById(mockCard.id);
        } catch(e){
            expect(e instanceof InternalServerError).toBe(true);
        }

    });
    
    test('should return a new Card Object when save adds a new user to the db', async () => {

        //Arrange
        expect.hasAssertions();

        let mockCard = new Card(1, 'test', 'test', 55.5, 55.5);
        (mockMapper.mapCardResultSet as jest.Mock).mockReturnValue(mockCard);

        //Act
        let result = await sut.save(mockCard);

        //Assert
        expect(result).toBeTruthy();
        expect(result instanceof Card).toBeTruthy();        

    });

    test('should return InternalServerError when save runs into an error adding to the db', async () => {

        expect.hasAssertions();

        let mockCard = new Card(1, 'test', 'test', 55.5, 55.5);
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    return false;
                }),
                release: jest.fn()
            };
        });

        try{
            await sut.save(mockCard);
        } catch(e){
            expect(e instanceof InternalServerError).toBe(true);
        }

    });

    test('should return the updated card when update is given a valid card to update', async() => {

        expect.hasAssertions();

        let mockCard = new Card(1, 'test', 'test', 55.5, 55.5);
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    return mockCard;
                }),
                release: jest.fn()
            };
        });

        let result = await sut.update(mockCard);

        expect(result).toBeTruthy();
        expect(result instanceof Card).toBe(true);

    });

    test('should return InternalServerError when update is given a invalid card to update', async() => {

        expect.hasAssertions();

        let mockCard = new Card(1, 'test', 'test', 55.5, 55.5);
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    throw new Error();
                }),
                release: jest.fn()
            };
        });

        try{
            await sut.update(mockCard);
        } catch (e){
            expect(e instanceof InternalServerError).toBe(true);
        }

    });

    test('should return true when deleteById is given a valid id to delete', async() => {

        expect.hasAssertions();

        let mockCard = new Card(1, 'test', 'test', 55.5, 55.5);
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    return true;
                }),
                release: jest.fn()
            };
        });

        let result = await sut.deleteById(mockCard.id);

        expect(result).toBeTruthy();
        expect(result).toBe(true);

    });

    test('should return InternalServerError when deleteById fails to delete a card', async() => {

        expect.hasAssertions();

        let mockCard = new Card(1, 'test', 'test', 55.5, 55.5);
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    throw new Error;
                }),
                release: jest.fn()
            };
        });

        try{
            await sut.deleteById(mockCard.id);
        } catch(e){
            expect( e instanceof InternalServerError).toBe(true);
        }

    });

    test('should return a card when getByName is given a valid ID', async() => {

        expect.hasAssertions();

        let mockCard = new Card(1, 'test', 'test', 55.5, 55.5);
        (mockMapper.mapCardResultSet as jest.Mock).mockReturnValue(mockCard);

        let result = await sut.getByName(mockCard.name);

        expect(result).toBeTruthy();
        expect(result instanceof Card).toBe(true);

    });

    test('should return a InternalServerError when getByName does not find a card with specified name  ', async() => {

        expect.hasAssertions();

        let mockCard = new Card(1, 'test', 'test', 55.5, 55.5);
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    return false;
                }),
                release: jest.fn()
            };
        });
        try{
            await sut.getByName(mockCard.name);
        } catch(e){
            expect(e instanceof InternalServerError).toBe(true);
        }

    });

    test('should return a user when getByRarity is given a valid rarity', async() => {

        expect.hasAssertions();

        let mockCard = new Card(1, 'test', 'Legendary', 55.5, 55.5);
        (mockMapper.mapCardResultSet as jest.Mock).mockReturnValue(mockCard);

        let result = await sut.getByRarity(mockCard.rarity);

        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);

    });

    test('should return a user when getByRarity is given a invalid rarity ', async() => {

        expect.hasAssertions();

        let mockCard = new Card(1, 'test', 'test', 55.5, 55.5);
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    return false;
                }),
                release: jest.fn()
            };
        });
        try{
            await sut.getByRarity(mockCard.rarity);
        } catch(e){
            expect(e instanceof InternalServerError).toBe(true);
        }

    });

    test('should return a user when getByUniqueKey is given valid key and value', async() => {

        expect.hasAssertions();

        let mockCard = new Card(1, 'test', 'test', 55.5, 55.5);
        (mockMapper.mapCardResultSet as jest.Mock).mockReturnValue(mockCard);

        let result = await sut.getCardByUniqueKey('name', mockCard.name);

        expect(result).toBeTruthy();
        expect(result instanceof Card).toBe(true);

    });

    test('should return a user when getByUniqueKey is given invalid key and value', async() => {

        expect.hasAssertions();

        let mockCard = new Card(1, 'test', 'test', 55.5, 55.5);
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    return false;
                }),
                release: jest.fn()
            };
        });

        try{
            await sut.getCardByUniqueKey('', mockCard.name);
        } catch(e){
            expect(e instanceof InternalServerError).toBe(true);
        }

    });

});


