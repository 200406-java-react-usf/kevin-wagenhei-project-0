export class User {

    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;

    constructor(id: number, un: string, fn: string, ln:string, email: string, pw: string){

        this.id = id;
        this.username = un;
        this.firstName = fn;
        this.lastName = ln;
        this.email = email;
        this.password = pw;

    }

}