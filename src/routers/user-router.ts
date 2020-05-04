import express from 'express';
import AppConfig from '../config/app';

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

UserRouter.get('/id/:id', async(req, resp) => {

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

UserRouter.get('/username/:username', async(req,resp) => {

    let username = req.params.username;

    try{
        let payload = await userService.getUserByUsername(username);
        resp.status(200).json(payload);
    } catch(e){
        resp.status(e.statusCode).json(e);
    }

    resp.send();

});

UserRouter.put('', async(req,resp) => {

    try{
        let payload = await userService.updateUser(req.body);
        resp.status(200).json(payload);
    } catch(e){
        resp.status(e.statusCode).json(e);
    }

    resp.send();

});

UserRouter.delete('', async(req, resp) => {

    try{
        let payload = await userService.deleteUser(req.body);
        resp.status(202).json(payload);
    } catch (e){
        resp.status(e.statusCode).json(e);
    }

    resp.send();

})