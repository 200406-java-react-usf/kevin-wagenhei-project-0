import {UserRepository} from '../repos/user-repo';
import * as mockIndex from '..';
import * as mockMapper from '../util/result-set-mapper'
import {User} from '../models/users';

//Mock Connection Pool
jest.mock('..', () => {
    return {
        connectionPool: {
            connect: jest.fn()
        }
    }
});

//Mock result set mapper
jest.mock('../util/result-set-mapper', () => {
    return {
        mapUserResultSet: jest.fn()
    }
});

describe('testing for userRepo', () => {

    let sut = new UserRepository();
    let mockConnect = mockIndex.connectionPool.connect;

    beforeEach(() =>{
        (mockConnect as jest.Mock).mockClear().mockImplementation(() =>{
            return {
                query: jest.fn().mockImplementation(() => {
                    return {

                        rows: [

                            {
                                id: 1,
                                username: 'Wagenheim',
                                password: 'password',
                                email: 'wagenheimk@me.com',
                                first_name: 'Kevin',
                                last_name: 'Wagenheim'
                            }
                        ]
                    }
                }),
                release: jest.fn()
            }
        });
        (mockMapper.mapUserResultSet as jest.Mock).mockClear();
    });

    test('should resolve to an array of Users when getAll is called', async () => {

        //Arrange
        expect.hasAssertions();

        let mockUser = new User(1, 'un', 'fn', 'ln', 'email', 'password');
        (mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);

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
                query: jest.fn().mockImplementation(() => { return {rows: []}}),
                release: jest.fn()
            }
        });

        //Act
        let result = await sut.getAll();

        //Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(0);
        expect(mockConnect).toBeCalledTimes(1);

    });

    test('should return a User Object when getById gets a User from the db', async () => {

        //Arrange
        expect.hasAssertions();

        let mockUser = new User(1, 'un', 'fn', 'ln', 'email', 'password');
        (mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);

        //Act
        let result = await sut.getById(1);

        //Assert
        expect(result).toBeTruthy();
        expect(result instanceof User).toBeTruthy();        

    });

});

