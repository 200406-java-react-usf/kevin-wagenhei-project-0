import express from 'express';
import AppConfig from '../config/app';

export const DeckRouter = express.Router();

let deckService = AppConfig.deckService;

DeckRouter.get('', async (req, resp) => {

    try{
        let payload = await deckService.getAllDecks();
        resp.status(200).json(payload);
    } catch(e){
        resp.status(e.statusCode).json(e);
    }

    resp.send();

});

DeckRouter.get('/:id', async (req, resp) => {

    let id = +req.params.id;

    try{
        let payload = await deckService.getDeckById(id);
        resp.status(200).json(payload);
    } catch(e){
        resp.status(e.statusCode).json(e);
    }

    resp.send();

});