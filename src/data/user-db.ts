import {User} from '../models/users';

let id = 1;

export default [

    new User(id++, 'Wagenheim', 'Kevin', 'Wagenheim', 'wagenheimk@me.com', 'password'),
    new User(id++, 'CameraGuyJohn', 'John', 'Egan', 'jvemedia@gmail.com', 'password'),
    new User(id++, 'Vacseal', 'Nick', 'Aliantro', 'naliantro@live.com', 'password'),
    new User(id++, 'LzM', 'Louis', 'Monacello', 'LzM_@me.com', 'password'),
    new User(id++, 'MuffErickson', 'Tyler', 'Erickson', 'MuffErickson@gmail.com', 'password')

];