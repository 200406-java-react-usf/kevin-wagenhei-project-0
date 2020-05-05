import {isValidId, isValidString, isValidObject, isPropertyOf, isEmptyObject} from '../util/validator';
import {User} from '../models/users';
import {Card} from '../models/cards';

describe('validator testing', () => {

    test(' should return true when isValidId is given a Valid ID', () => {

        expect.assertions(3);

        let rOne = isValidId(1);
        let rTwo = isValidId(999);
        let rThree = isValidId(Number('50'));

        expect(rOne).toBe(true);
        expect(rTwo).toBe(true);
        expect(rThree).toBe(true);

    });

    test(' should return false when isValidId is given an invalid ID', () => {

        expect.assertions(5);

        let rOne = isValidId(-1);
        let rTwo = isValidId(NaN);
        let rThree = isValidId(null);
        let rFour = isValidId(3.14);
        let rFive = isValidId(0);

        expect(rOne).toBe(false);
        expect(rTwo).toBe(false);
        expect(rThree).toBe(false);
        expect(rFour).toBe(false);
        expect(rFive).toBe(false);

    });

    test('should return true when isValidString is given a valid String', () =>{

        let rOne = isValidString('Meow');
        let rTwo = isValidString('Meow', 'Ruff');
        let rThree = isValidString(String('Meow'));
        let rFour = isValidString(String('hello'), String('world'));

        expect(rOne).toBe(true);
        expect(rTwo).toBe(true);
        expect(rThree).toBe(true);
        expect(rFour).toBe(true);

    });

    test('should return false when isValidString is given a valid String', () =>{

        let rOne = isValidString('');
        let rTwo = isValidString('Meow', '');
        let rThree = isValidString(String(''));
        let rFour = isValidString(String('hello'), String(''));

        expect(rOne).toBe(false);
        expect(rTwo).toBe(false);
        expect(rThree).toBe(false);
        expect(rFour).toBe(false);

    });

    test('should return true when given valid objects', () => {

        let rOne = isValidObject(new Card(1, 'Escrivate', 'Common', 57.1, 54));
        let rTwo = isValidObject(new User(3, 'Vacseal', 'Nick', 'Aliantro', 'naliantro@live.com', 'password'));

        expect(rOne).toBe(true);
        expect(rTwo).toBe(true);

    });

    test('should return true when given valid objects with nullable props', () => {

        let rOne = isValidObject(new Card(0, 'Escrivate', 'Common', 57.1, 54), 'id');
        let rTwo = isValidObject(new User(0, 'Vacseal', 'Nick', 'Aliantro', 'naliantro@live.com', 'password'), 'id');

        expect(rOne).toBe(true);
        expect(rTwo).toBe(true);

    });

    test('should return false when given in valid objects', () => {

        let rOne = isValidObject(new Card(1, '', 'Common', 57.1, 54));
        let rTwo = isValidObject(new User(3, 'Vacseal', 'Nick', '', 'naliantro@live.com', 'password'));

        expect(rOne).toBe(false);
        expect(rTwo).toBe(false);

    });

    test('should return false when given valid objects with nullable props', () => {

        let rOne = isValidObject(new Card(0, '', 'Common', 57.1, 54), 'id');
        let rTwo = isValidObject(new User(0, 'Vacseal', 'Nick', '', 'naliantro@live.com', 'password'), 'id');

        expect(rOne).toBe(false);
        expect(rTwo).toBe(false);

    });

    test('should return true when given a valid key of an object', () => {

        let rOne = isPropertyOf('username', User);
        let rTwo = isPropertyOf('rarity', Card);

        expect(rOne).toBe(true);
        expect(rTwo).toBe(true);

    });

    test('should return false when given a invalid key of an object', () => {

        let rOne = isPropertyOf('notReal', User);
        let rTwo = isPropertyOf('Meow', Card);

        expect(rOne).toBe(false);
        expect(rTwo).toBe(false);

    });

    test('should return false when given a invalid key of an object', () => {

        let rOne = isPropertyOf('notReal', {meow: 'yes'});
        let rTwo = isPropertyOf('', 2);
        let rThree = isPropertyOf('ruff', false);
        let rFour = isPropertyOf('3', 'four');

        expect(rOne).toBe(false);
        expect(rTwo).toBe(false);
        expect(rThree).toBe(false);
        expect(rFour).toBe(false);

    });

    test('should return true when object is not empty', () => {

        let rOne = isEmptyObject(new Card(1, 'Escrivate', 'Common', 57.1, 54));
        let rTwo = isEmptyObject(new User(3, 'Vacseal', 'Nick', 'Aliantro', 'naliantro@live.com', 'password'));

        expect(rOne).toBe(true);
        expect(rTwo).toBe(true);

    });

    test('should return false when object is not empty', () => {

        let rOne = isEmptyObject('');
        let rTwo = isEmptyObject({});

        expect(rOne).toBe(false);
        expect(rTwo).toBe(false);

    });

});