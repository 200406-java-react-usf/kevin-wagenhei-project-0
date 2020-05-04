import express from 'express';
import AppConfig from '../config/app';

export const CardRouter = express.Router();

let cardService = AppConfig.cardService;

CardRouter.get('', async(req,resp) => {

    try{

        let payload = await cardService.getAllCards();
        resp.status(200).json(payload);

    } catch (e){
        resp.status(e.statusCode).json(e);
    }

    resp.send();

});

CardRouter.get('/:id', async (req, resp) => {

    const id = +req.params.id;

    try{
        let payload = await cardService.getCardById(id);
        resp.status(200).json(payload);
    } catch(e){
        resp.status(e.statusCode).json(e);
    }

    resp.send();

});

CardRouter.post('', async (req,resp) => {

    try{
        let payload = await cardService.addNewCard(req.body);
        resp.status(201).json(payload);
    } catch(e){
        resp.status(e.statusCode).json(e)
    }

    resp.send();

});

CardRouter.put('', async(req,resp) => {

    try{
        let payload = await cardService.updateCard(req.body);
        resp.status(200).json(payload);
    } catch(e){
        resp.status(e.statusCode).json(e);
    }

    resp.send();

});

CardRouter.delete('', async(req, resp) => {

    try{
        let payload = await cardService.deleteCard(req.body);
        resp.status(202).json(payload);
    } catch (e){
        resp.status(e.statusCode).json(e);
    }

    resp.send();

});