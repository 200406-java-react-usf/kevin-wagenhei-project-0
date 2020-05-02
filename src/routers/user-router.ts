import express from 'express';
import AppConfig from '../config/app';
import e from 'express';

export const UserRouter = express.Router();

let userService = AppConfig.userService;

UserRouter.get('', async(req, resp) => {

    try{
        let payload = await userService.getAllUsers();
        resp.status(200).json(payload);
    } catch(e){
        resp.status(e.statusCode).json(e);
    }

    resp.send();

});

UserRouter.get('/:id', async(req, resp) => {

    let id = +req.params.id;

    try{
        let payload = await userService.getUserById(id);
        resp.status(200).json(payload);
    } catch (e){
        resp.status(e.statusCode).json(e);
    }

    resp.send();

});

UserRouter.post('', async(req, resp) => {

    try{
        let payload = await userService.addNewUser(req.body);
        resp.status(201).json(payload);
    } catch (e){
        resp.status(e.statusCode).json(e);
    }

    resp.send();

});