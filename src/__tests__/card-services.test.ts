import {CardService} from '../services/card-services';
import {CardRepository} from '../repos/card-repo';
import {Card} from '../models/cards';
import Validator from '../util/validator';
import {ResourceNotFoundError, InvalidInputError, AuthenticationError, ResourceConflictError} from '../errors/errors';
import cardDb from '../data/card-db';

jest.mock('../repos/card-repo', () => {

    return new class CardRepository{
        getAll = jest.fn();
        getById = jest.fn();
        getCardByUniqueKey = jest.fn();
        save = jest.fn();
        update = jest.fn();
        deleteById = jest.fn();
        getByRarity = jest.fn();
        getByName = jest.fn();
    }

});

describe('tests for the card Service', () => {

    let sut: CardService;
    let mockRepo;

    let mockCards = [
        new Card(1, 'Escrivate', 'Common', 57.1, 54),
        new Card(2, 'Ice Barriar', 'Common',54, 49),
        new Card(3, 'Blizzard', 'Rare', 11.2, 44.9),
        new Card(4, 'Wrath', 'Common',53.7, 46.9),
        new Card(5, 'Shadowstep', 'Common', 55.5, 52.4)
    ];

    beforeEach(() => {

        mockRepo = jest.fn(() => {  
            return {
                getAll: jest.fn(),
                getById: jest.fn(),
                getUserByUniqueKey: jest.fn(),
                save: jest.fn(),
                update: jest.fn(),
                deleteById: jest.fn(),
                getByUsername: jest.fn(),
                getByCredentials: jest.fn()
            }
        });

        sut = new CardService(mockRepo);

    });

    test('should return a Card[] when getAllCards is called', async () => {

        //Arrange
        expect.hasAssertions();
        mockRepo.getAll = jest.fn().mockReturnValue(mockCards);

        //Act
        let result = await sut.getAllCards();

        //Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(5);

    });

    test('should return a ResourceNotFoundError when getAllCards is called and db is empty', async () => {

        //Arrange
        expect.assertions(1);
        mockRepo.getAll = jest.fn().mockReturnValue([]);

        try{
            //Act
            await sut.getAllCards();
        } catch (e){
            //Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }
        
    });

    test('should return a card when getById is called with correct ID', async () => {

        expect.assertions(2);

        Validator.isValidId = jest.fn().mockReturnValue(true);

        mockRepo.getById = jest.fn().mockImplementation((id: number) => {
            return new Promise<Card>((resolve) => resolve(mockCards[id-1]));
        });

        let result = await sut.getCardById(1);

        expect(result).toBeTruthy();
        expect(result.id).toBe(1);

    });

    test('should return InvalidInputError when getById is given an invalid id(decimal)', async () => {

        expect.assertions(1);
        mockRepo.getById = jest.fn().mockReturnValue(false);

        try{
            await sut.getCardById(3.14);
        } catch(e){
            expect(e instanceof InvalidInputError).toBe(true);
        }

    });

    test('should return InvalidInputError when getById is given an invalid id(0)', async () => {

        expect.assertions(1);
        mockRepo.getById = jest.fn().mockReturnValue(false);

        try{
            await sut.getCardById(0);
        } catch(e){
            expect(e instanceof InvalidInputError).toBe(true);
        }

    });

    test('should return InvalidInputError when getById is given an invalid id(NaN)', async () => {

        expect.assertions(1);
        mockRepo.getById = jest.fn().mockReturnValue(false);

        try{
            await sut.getCardById(NaN);
        } catch(e){
            expect(e instanceof InvalidInputError).toBe(true);
        }

    });

    test('should return InvalidInputError when getById is given an invalid id(negative)', async () => {

        expect.assertions(1);
        mockRepo.getById = jest.fn().mockReturnValue(false);

        try{
            await sut.getCardById(-1);
        } catch(e){
            expect(e instanceof InvalidInputError).toBe(true);
        }

    });

    test('should return InvalidInputError when getById is given an id that does not exist in db', async () => {

        expect.assertions(1);
        mockRepo.getById = jest.fn().mockReturnValue(true);

        try{
            await sut.getCardById(9000);
        } catch(e){
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should return a card when getByName is called with correct name', async () => {

        expect.assertions(2);

        Validator.isValidString = jest.fn().mockReturnValue(true);

        mockRepo.getByName = jest.fn().mockImplementation((name: string) => {
            return new Promise<Card>((resolve) => resolve(mockCards.find(card => card.name === name)));
        });

        let result = await sut.getCardByName('Blizzard');

        expect(result).toBeTruthy();
        expect(result.id).toBe(3);

    });

    test('should return a ResourceNotFoundError when checking for a name that doesnt exist', async () => {

        expect.assertions(1);

        Validator.isValidString = jest.fn().mockReturnValue(true);

        mockRepo.getByName = jest.fn().mockImplementation((name: string) => {
            return new Promise<Card>((resolve) => resolve(mockCards.find(cards => cards.name === name)));
        });

        try{
            await sut.getCardByName('Meow');
        }catch(e){
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should return a InvalidInputError when checking for a name that is falsy', async () => {

        expect.assertions(1);

        Validator.isValidString = jest.fn().mockReturnValue(false);

        mockRepo.getByName = jest.fn().mockImplementation((name: string) => {
            return new Promise<Card>((resolve) => resolve(mockCards.find(card => card.name === name)));
        });

        try{
            await sut.getCardByName('');
        }catch(e){
            expect(e instanceof InvalidInputError).toBe(true);
        }

    });

    test('should return a card when getByRarity is given valid rarity', async () => {

        expect.assertions(3);

        Validator.isValidString = jest.fn().mockReturnValue(true);

        mockRepo.getByRarity = jest.fn().mockImplementation((rarity: string) => {
            return new Promise<Card[]>((resolve) => resolve(mockCards.filter(card => card.rarity === rarity)));
        });

        let result = await sut.getCardByRarity('Common');

        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(4);

    });

    test('should return a ResourceNotFoundError when given a rarity that does not exist', async () => {

        expect.assertions(1);

        Validator.isValidString = jest.fn().mockReturnValue(true);

        mockRepo.getByRarity = jest.fn().mockImplementation((rarity: string, pw: string) => {
            return new Promise<Card[]>((resolve) => resolve(mockCards.filter(card => card.rarity === rarity)));
        });

        try{
            await sut.getCardByRarity('Meow');
        }catch(e){
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should return a InvalidInput error when given a falsy rarity', async () => {

        expect.assertions(1);

        Validator.isValidString = jest.fn().mockReturnValue(false);

        mockRepo.getByRarity = jest.fn().mockImplementation((rarity: string) => {
            return new Promise<Card[]>((resolve) => resolve(mockCards.filter(card => card.rarity === rarity )));
        });

        try{
            await sut.getCardByRarity('');
        }catch(e){
            expect(e instanceof InvalidInputError).toBe(true);
        }

    });

    test('should add a new user when addNewCard is given a valid Card Obj', async () => {

        expect.assertions(2);

        Validator.isValidObject = jest.fn().mockReturnValue(true);

        sut.isCardAlreadyAdded = jest.fn().mockReturnValue(true);

        mockRepo.save = jest.fn().mockImplementation((newCard: Card) => {
            return new Promise<Card> ((resolve) => {
                mockCards.push(newCard);
                resolve(newCard);
            });
        });

        let result = await sut.addNewCard(new Card(0,'test','test', 55.5, 55.5));

        expect(result).toBeTruthy();
        expect(mockCards.length).toBe(6);

    });

    test('should throw ResourceConflictError when passing in to addNewCard a Card that has a name that already exists', async () => {

        expect.assertions(1);

        Validator.isValidObject = jest.fn().mockReturnValue(true);

        sut.isCardAlreadyAdded = jest.fn().mockReturnValue(false);

        mockRepo.save = jest.fn().mockImplementation((newCard: Card) => {
            return new Promise<Card> ((resolve) => {
                mockCards.push(newCard);
                resolve(newCard);
            });
        });

        try{
            await sut.addNewCard(new Card(0,'Blizzard','test', 55.5, 55.5));
        } catch (e){
            expect(e instanceof ResourceConflictError).toBe(true);
        }

    });

    test('should throw ResourceConflictError when passing in to addNewUsser a falsy name', async () => {

        expect.assertions(1);

        Validator.isValidObject = jest.fn().mockReturnValue(false);

        sut.isCardAlreadyAdded = jest.fn().mockReturnValue(true);

        mockRepo.save = jest.fn().mockImplementation((newCard: Card) => {
            return new Promise<Card> ((resolve) => {
                mockCards.push(newCard);
                resolve(newCard);
            });
        });

        try{
            await sut.addNewCard(new Card(0,'','test', 55.5, 55.5));
        } catch (e){
            expect(e instanceof InvalidInputError).toBe(true);
        }

    });

    test('should throw ResourceConflictError when passing in to addNewCard a falsy rarity', async () => {

        expect.assertions(1);

        Validator.isValidObject = jest.fn().mockReturnValue(false);

        sut.isCardAlreadyAdded = jest.fn().mockReturnValue(true);

        mockRepo.save = jest.fn().mockImplementation((newCard: Card) => {
            return new Promise<Card> ((resolve) => {
                mockCards.push(newCard);
                resolve(newCard);
            });
        });

        try{
            await sut.addNewCard(new Card(0,'test','', 55.5, 55.5));
        } catch (e){
            expect(e instanceof InvalidInputError).toBe(true);
        }

    });

    // test('should return correct user when given correct key and value for getByUniqueKey', async () => {

    //     expect.assertions(2);

    //     Validator.isPropertyOf = jest.fn().mockReturnValue(true);
    //     Validator.isEmptyObject = jest.fn().mockReturnValue(true);
    //     Validator.isValidString = jest.fn().mockReturnValue(true);

    //     mockRepo.getUserByUniqueKey = jest.fn().mockImplementation((key: string, val: string) => {
    //         return new Promise<User> ((resolve) => {
    //            resolve(mockUsers.find(user => user[key] === val));
    //         });
    //     });

    //     let result = await sut.getUserByUniqueKey({username: 'Vacseal'});

    //     expect(result).toBeTruthy();
    //     expect(result.id).toBe(3);

    // });

    // test('should return ResourceNotFoundError when given a value for getByUniqueKey that does not exist', async () => {

    //     expect.assertions(1);

    //     Validator.isPropertyOf = jest.fn().mockReturnValue(true);
    //     Validator.isEmptyObject = jest.fn().mockReturnValue(false);
    //     Validator.isValidString = jest.fn().mockReturnValue(true);

    //     mockRepo.getUserByUniqueKey = jest.fn().mockImplementation((key: string, val: string) => {
    //         return new Promise<User> ((resolve) => {
    //            resolve(mockUsers.find(user => user[key] === val));
    //         });
    //     });

    //     try{
    //         await sut.getUserByUniqueKey({username: 'Meow'});
    //     } catch(e){
    //         expect(e instanceof ResourceNotFoundError).toBe(true);
    //     }

    // });

    // test('should return InvalidInputError when given a key for getByUniqueKey that does not exist', async () => {

    //     expect.assertions(1);

    //     Validator.isPropertyOf = jest.fn().mockReturnValue(false);
    //     Validator.isEmptyObject = jest.fn().mockReturnValue(false);
    //     Validator.isValidString = jest.fn().mockReturnValue(true);

    //     mockRepo.getUserByUniqueKey = jest.fn().mockImplementation((key: string, val: string) => {
    //         return new Promise<User> ((resolve) => {
    //            resolve(mockUsers.find(user => user[key] === val));
    //         });
    //     });

    //     try{
    //         await sut.getUserByUniqueKey({meow: 'Vacseal'});
    //     } catch(e){
    //         expect(e instanceof InvalidInputError).toBe(true);
    //     }

    // });

    // test('should return InvalidInputError when given a key and value for getByUniqueKey that does not exist', async () => {

    //     expect.assertions(1);

    //     Validator.isPropertyOf = jest.fn().mockReturnValue(false);
    //     Validator.isEmptyObject = jest.fn().mockReturnValue(false);
    //     Validator.isValidString = jest.fn().mockReturnValue(true);

    //     mockRepo.getUserByUniqueKey = jest.fn().mockImplementation((key: string, val: string) => {
    //         return new Promise<User> ((resolve) => {
    //            resolve(mockUsers.find(user => user[key] === val));
    //         });
    //     });

    //     try{
    //         await sut.getUserByUniqueKey({meow: 'Meow'});
    //     } catch(e){
    //         expect(e instanceof InvalidInputError).toBe(true);
    //     }

    // });

    // test('should return InvalidInputError when given a falsy value for val', async () => {

    //     expect.assertions(1);

    //     Validator.isPropertyOf = jest.fn().mockReturnValue(true);
    //     Validator.isEmptyObject = jest.fn().mockReturnValue(true);
    //     Validator.isValidString = jest.fn().mockReturnValue(false);

    //     mockRepo.getUserByUniqueKey = jest.fn().mockImplementation((key: string, val: string) => {
    //         return new Promise<User> ((resolve) => {
    //            resolve(mockUsers.find(user => user[key] === val));
    //         });
    //     });

    //     try{
    //         await sut.getUserByUniqueKey({Username: ''});
    //     } catch(e){
    //         expect(e instanceof InvalidInputError).toBe(true);
    //     }

    // });

    // test('should return a user when getByUniqueKey is given an id key and a correct value', async () => {

    //     expect.assertions(3);

    //     Validator.isPropertyOf = jest.fn().mockReturnValue(true);
    //     Validator.isEmptyObject = jest.fn().mockReturnValue(true);
    //     Validator.isValidString = jest.fn().mockReturnValue(true);

    //     sut.getUserById = jest.fn().mockImplementation((id: number) => {
    //         return new Promise<User>((resolve) => {
    //             resolve(mockUsers.find(user => user.id === id));
    //         });
    //     })

    //     mockRepo.getUserByUniqueKey = jest.fn().mockImplementation((key: string, val: string) => {
    //         return new Promise<User> ((resolve) => {
    //            resolve(mockUsers.find(user => user[key] === val));
    //         });
    //     });

    //     let result = await sut.getUserByUniqueKey({id: 3});
    //     expect(result).toBeTruthy();
    //     expect(result.id).toBe(3)
    //     expect(result.username).toBe('Vacseal');

    // });

    // test('should update a new user when updateUser is given a correct User that exists', async () => {

    //     expect.assertions(2);

    //     Validator.isValidId = jest.fn().mockReturnValue(true);
    //     Validator.isValidObject = jest.fn().mockReturnValue(true);

    //     sut.isUsernameAvailable = jest.fn().mockReturnValue(true);
    //     sut.isEmailAvailable = jest.fn().mockReturnValue(true);

    //     sut.getUserById = jest.fn().mockImplementation((id: number) => {
    //         return new Promise<User> ((resolve) => {
    //             resolve(mockUsers.find(user => user.id === id));
    //         });
    //     });

    //     mockRepo.update = jest.fn().mockImplementation((updateUser: User) => {
    //         return new Promise<User> ((resolve) => {
    //             resolve(updateUser);
    //         });
    //     });

    //     let result = await sut.updateUser(new User(3,'update','update','update','update','update'));

    //     expect(result).toBeTruthy();
    //     expect(result.id).toBe(3);

    // });

    // test('should throw a ResourceNotFoundError when given an id to update that doesnt exist', async () => {

    //     expect.assertions(1);

    //     Validator.isValidId = jest.fn().mockReturnValue(true);
    //     Validator.isValidObject = jest.fn().mockReturnValue(true);

    //     sut.isUsernameAvailable = jest.fn().mockReturnValue(true);
    //     sut.isEmailAvailable = jest.fn().mockReturnValue(true);

    //     sut.getUserById = jest.fn().mockImplementation((id: number) => {
    //         return new Promise<User> ((resolve) => {
    //             resolve(mockUsers.find(user => user.id === id));
    //         });
    //     });

    //     mockRepo.update = jest.fn().mockImplementation((updateUser: User) => {
    //         return new Promise<User> ((resolve) => {
    //             resolve(updateUser);
    //         });
    //     });

    //     try{
    //         await sut.updateUser(new User(50,'update','update','update','update','update'));
    //     } catch(e){
    //         expect(e instanceof ResourceNotFoundError).toBe(true);
    //     }
    // });

    // test('should throw a ResourceConflictError when updating to a username that already exists', async () => {

    //     expect.assertions(1);

    //     Validator.isValidId = jest.fn().mockReturnValue(true);
    //     Validator.isValidObject = jest.fn().mockReturnValue(true);

    //     sut.isUsernameAvailable = jest.fn().mockReturnValue(false);
    //     sut.isEmailAvailable = jest.fn().mockReturnValue(true);

    //     sut.getUserById = jest.fn().mockImplementation((id: number) => {
    //         return new Promise<User> ((resolve) => {
    //             resolve(mockUsers.find(user => user.id === id));
    //         });
    //     });

    //     mockRepo.update = jest.fn().mockImplementation((updateUser: User) => {
    //         return new Promise<User> ((resolve) => {
    //             resolve(updateUser);
    //         });
    //     });

    //     try{
    //         await sut.updateUser(new User(3,'Wagenheim','update','update','update','update'));
    //     } catch(e){
    //         expect(e instanceof ResourceConflictError).toBe(true);
    //     }
    // });

    // test('should throw a ResourceConflictError when updating to a email that already exists', async () => {

    //     expect.assertions(1);

    //     Validator.isValidId = jest.fn().mockReturnValue(true);
    //     Validator.isValidObject = jest.fn().mockReturnValue(true);

    //     sut.isUsernameAvailable = jest.fn().mockReturnValue(true);
    //     sut.isEmailAvailable = jest.fn().mockReturnValue(false);

    //     sut.getUserById = jest.fn().mockImplementation((id: number) => {
    //         return new Promise<User> ((resolve) => {
    //             resolve(mockUsers.find(user => user.id === id));
    //         });
    //     });

    //     mockRepo.update = jest.fn().mockImplementation((updateUser: User) => {
    //         return new Promise<User> ((resolve) => {
    //             resolve(updateUser);
    //         });
    //     });

    //     try{
    //         await sut.updateUser(new User(3,'update','wagenheimk@me.com','update','update','update'));
    //     } catch(e){
    //         expect(e instanceof ResourceConflictError).toBe(true);
    //     }
    // });

    // test('should still update when a user wants to keep their username but change everything else', async () => {

    //     expect.assertions(2);

    //     Validator.isValidId = jest.fn().mockReturnValue(true);
    //     Validator.isValidObject = jest.fn().mockReturnValue(true);

    //     sut.isUsernameAvailable = jest.fn().mockReturnValue(true);
    //     sut.isEmailAvailable = jest.fn().mockReturnValue(true);

    //     sut.getUserById = jest.fn().mockImplementation((id: number) => {
    //         return new Promise<User> ((resolve) => {
    //             resolve(mockUsers.find(user => user.id === id));
    //         });
    //     });

    //     mockRepo.update = jest.fn().mockImplementation((updateUser: User) => {
    //         return new Promise<User> ((resolve) => {
    //             resolve(updateUser);
    //         });
    //     });

    //     let result = await sut.updateUser(new User(3,'Vacseal','update','update','update','update'));

    //     expect(result).toBeTruthy();
    //     expect(result.id).toBe(3);

    // });

    // test('should still update when a user wants to keep their email but change everything else', async () => {

    //     expect.assertions(2);

    //     Validator.isValidId = jest.fn().mockReturnValue(true);
    //     Validator.isValidObject = jest.fn().mockReturnValue(true);

    //     sut.isUsernameAvailable = jest.fn().mockReturnValue(true);
    //     sut.isEmailAvailable = jest.fn().mockReturnValue(true);

    //     sut.getUserById = jest.fn().mockImplementation((id: number) => {
    //         return new Promise<User> ((resolve) => {
    //             resolve(mockUsers.find(user => user.id === id));
    //         });
    //     });

    //     mockRepo.update = jest.fn().mockImplementation((updateUser: User) => {
    //         return new Promise<User> ((resolve) => {
    //             resolve(updateUser);
    //         });
    //     });

    //     let result = await sut.updateUser(new User(3,'update','update','update','naliantro@live.com','update'));

    //     expect(result).toBeTruthy();
    //     expect(result.id).toBe(3);

    // });

    // test('Should throw InvalidInputError when given an invalid ID in the updated User', async () => {

    //     expect.assertions(1);

    //     Validator.isValidId = jest.fn().mockReturnValue(false);
    //     Validator.isValidObject = jest.fn().mockReturnValue(true);

    //     sut.isUsernameAvailable = jest.fn().mockReturnValue(true);
    //     sut.isEmailAvailable = jest.fn().mockReturnValue(true);

    //     sut.getUserById = jest.fn().mockImplementation((id: number) => {
    //         return new Promise<User> ((resolve) => {
    //             resolve(mockUsers.find(user => user.id === id));
    //         });
    //     });

    //     mockRepo.update = jest.fn().mockImplementation((updateUser: User) => {
    //         return new Promise<User> ((resolve) => {
    //             resolve(updateUser);
    //         });
    //     });

    //     try{
    //         await sut.updateUser(new User(-1,'update','update','update','update','update'))
    //     } catch (e){
    //         expect(e instanceof InvalidInputError).toBe(true);
    //     }

    // });

    // test('Should throw InvalidInputError when given an invalid User object in the updated User(username)', async () => {

    //     expect.assertions(1);

    //     Validator.isValidId = jest.fn().mockReturnValue(true);
    //     Validator.isValidObject = jest.fn().mockReturnValue(false);

    //     sut.isUsernameAvailable = jest.fn().mockReturnValue(true);
    //     sut.isEmailAvailable = jest.fn().mockReturnValue(true);

    //     sut.getUserById = jest.fn().mockImplementation((id: number) => {
    //         return new Promise<User> ((resolve) => {
    //             resolve(mockUsers.find(user => user.id === id));
    //         });
    //     });

    //     mockRepo.update = jest.fn().mockImplementation((updateUser: User) => {
    //         return new Promise<User> ((resolve) => {
    //             resolve(updateUser);
    //         });
    //     });

    //     try{
    //         await sut.updateUser(new User(3,'','update','update','update','update'))
    //     } catch (e){
    //         expect(e instanceof InvalidInputError).toBe(true);
    //     }

    // });

    // test('Should throw InvalidInputError when given an invalid User object in the updated User(first name)', async () => {

    //     expect.assertions(1);

    //     Validator.isValidId = jest.fn().mockReturnValue(true);
    //     Validator.isValidObject = jest.fn().mockReturnValue(false);

    //     sut.isUsernameAvailable = jest.fn().mockReturnValue(true);
    //     sut.isEmailAvailable = jest.fn().mockReturnValue(true);

    //     sut.getUserById = jest.fn().mockImplementation((id: number) => {
    //         return new Promise<User> ((resolve) => {
    //             resolve(mockUsers.find(user => user.id === id));
    //         });
    //     });

    //     mockRepo.update = jest.fn().mockImplementation((updateUser: User) => {
    //         return new Promise<User> ((resolve) => {
    //             resolve(updateUser);
    //         });
    //     });

    //     try{
    //         await sut.updateUser(new User(3,'update','','update','update','update'))
    //     } catch (e){
    //         expect(e instanceof InvalidInputError).toBe(true);
    //     }

    // });

    // test('Should throw InvalidInputError when given an invalid User object in the updated User(last name)', async () => {

    //     expect.assertions(1);

    //     Validator.isValidId = jest.fn().mockReturnValue(true);
    //     Validator.isValidObject = jest.fn().mockReturnValue(false);

    //     sut.isUsernameAvailable = jest.fn().mockReturnValue(true);
    //     sut.isEmailAvailable = jest.fn().mockReturnValue(true);

    //     sut.getUserById = jest.fn().mockImplementation((id: number) => {
    //         return new Promise<User> ((resolve) => {
    //             resolve(mockUsers.find(user => user.id === id));
    //         });
    //     });

    //     mockRepo.update = jest.fn().mockImplementation((updateUser: User) => {
    //         return new Promise<User> ((resolve) => {
    //             resolve(updateUser);
    //         });
    //     });

    //     try{
    //         await sut.updateUser(new User(3,'update','update','','update','update'))
    //     } catch (e){
    //         expect(e instanceof InvalidInputError).toBe(true);
    //     }

    // });

    // test('Should throw InvalidInputError when given an invalid User object in the updated User(email)', async () => {

    //     expect.assertions(1);

    //     Validator.isValidId = jest.fn().mockReturnValue(true);
    //     Validator.isValidObject = jest.fn().mockReturnValue(false);

    //     sut.isUsernameAvailable = jest.fn().mockReturnValue(true);
    //     sut.isEmailAvailable = jest.fn().mockReturnValue(true);

    //     sut.getUserById = jest.fn().mockImplementation((id: number) => {
    //         return new Promise<User> ((resolve) => {
    //             resolve(mockUsers.find(user => user.id === id));
    //         });
    //     });

    //     mockRepo.update = jest.fn().mockImplementation((updateUser: User) => {
    //         return new Promise<User> ((resolve) => {
    //             resolve(updateUser);
    //         });
    //     });

    //     try{
    //         await sut.updateUser(new User(3,'update','update','update','','update'))
    //     } catch (e){
    //         expect(e instanceof InvalidInputError).toBe(true);
    //     }

    // });

    // test('Should throw InvalidInputError when given an invalid User object in the updated User(password)', async () => {

    //     expect.assertions(1);

    //     Validator.isValidId = jest.fn().mockReturnValue(true);
    //     Validator.isValidObject = jest.fn().mockReturnValue(false);

    //     sut.isUsernameAvailable = jest.fn().mockReturnValue(true);
    //     sut.isEmailAvailable = jest.fn().mockReturnValue(true);

    //     sut.getUserById = jest.fn().mockImplementation((id: number) => {
    //         return new Promise<User> ((resolve) => {
    //             resolve(mockUsers.find(user => user.id === id));
    //         });
    //     });

    //     mockRepo.update = jest.fn().mockImplementation((updateUser: User) => {
    //         return new Promise<User> ((resolve) => {
    //             resolve(updateUser);
    //         });
    //     });

    //     try{
    //         await sut.updateUser(new User(3,'update','update','update','update',''))
    //     } catch (e){
    //         expect(e instanceof InvalidInputError).toBe(true);
    //     }

    // });

    // test('should return true when delete user is given a valid id of a user to be deleted', async () => {

    //     expect.assertions(1);

    //     Validator.isValidId = jest.fn().mockReturnValue(true);

    //     sut.getUserById = jest.fn().mockImplementation((id: number) => {
    //         return new Promise<User> ((resolve) => {
    //             resolve(mockUsers.find(user => user.id === id));
    //         });
    //     });

    //     mockRepo.deleteById = jest.fn().mockImplementation((id:number) => {
    //         return new Promise<boolean> ((resolve) => {
    //             mockUsers = mockUsers.slice(0,id).concat(mockUsers.slice(id+1,mockUsers.length));
    //             resolve(true);
    //         });
    //     });

    //     let result = await sut.deleteUser({id: 3});

    //     expect(result).toBe(true);

    // });

    // test('should return ResourceNotFoundError when id given does not exist', async () => {

    //     expect.assertions(1);

    //     Validator.isValidId = jest.fn().mockReturnValue(false);

    //     sut.getUserById = jest.fn().mockImplementation((id: number) => {
    //         return new Promise<User> ((resolve) => {
    //             resolve(mockUsers.find(user => user.id === id));
    //         });
    //     });

    //     mockRepo.deleteById = jest.fn().mockImplementation((id:number) => {
    //         return new Promise<boolean> ((resolve) => {
    //             mockUsers = mockUsers.slice(0,id).concat(mockUsers.slice(id+1,mockUsers.length));
    //             resolve(true);
    //         });
    //     });

    //     try{
    //         await sut.deleteUser({id: 3000});
    //     } catch(e){
    //         expect(e instanceof ResourceNotFoundError).toBe(true);
    //     }

    // });

    // test('should return InvalidInputError when id is not a valid ID', async () => {

    //     expect.assertions(1);

    //     Validator.isValidId = jest.fn().mockReturnValue(false);

    //     sut.getUserById = jest.fn().mockImplementation((id: number) => {
    //         return new Promise<User> ((resolve) => {
    //             resolve(mockUsers.find(user => user.id === id));
    //         });
    //     });

    //     mockRepo.deleteById = jest.fn().mockImplementation((id:number) => {
    //         return new Promise<boolean> ((resolve) => {
    //             mockUsers = mockUsers.slice(0,id).concat(mockUsers.slice(id+1,mockUsers.length));
    //             resolve(true);
    //         });
    //     });

    //     try{
    //         await sut.deleteUser({id: -1});
    //     } catch(e){
    //         expect(e instanceof InvalidInputError).toBe(true);
    //     }

    // });

    

});