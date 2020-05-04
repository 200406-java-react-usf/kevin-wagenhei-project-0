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

DeckRouter.get('/author/:id', async (req, resp) => {

    let id = +req.params.id;

    try{
        let payload = await deckService.getDeckByAuthorId(id);
        resp.status(200).json(payload);
    } catch(e){
        resp.status(e.statusCode).json(e);
    }

    resp.send();

});

DeckRouter.get('/name/:name', async (req, resp) => {

    let name = req.params.name;

    try{
        let payload = await deckService.getDeckByName(name);
        resp.status(200).json(payload);
    } catch(e){
        resp.status(e.statusCode).json(e);
    }

    resp.send();

});

DeckRouter.post('', async (req, resp) => {

    try{
        let payload = await deckService.addNewDeck(req.body);
        resp.status(201).json(payload);
    } catch (e){
        resp.status(e.statusCode).json(e);
    }

    resp.send();

});

DeckRouter.delete('', async (req, resp) => {

    try{
        let payload = await deckService.deleteDeck(req.body);
        resp.status(202).json(payload);
    } catch(e){
        resp.status(e.statusCode).json(e);
    }

    resp.send();

});