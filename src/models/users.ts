export class User {

    id: number;
    username: string;
    fullName: string;
    email: string;
    password: string;

    constructor(id: number, un: string, fn: string, email: string, pw: string){

        this.id = id;
        this.username = un;
        this.fullName = fn;
        this.email = email;
        this.password = pw;

    }

}