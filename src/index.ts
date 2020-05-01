import {CardRepository} from './repos/card-repo';
import { Card } from './models/cards';
import {UserRepository} from './repos/user-repo';
import {User} from './models/users';
import {DeckRepository} from './repos/deck-repo';
import {Deck} from './models/decks';
import {CardService} from './services/card-services';
import AppConfig from './config/app';
import {CardRouter} from './routers/card-router';
import {DeckRouter} from './routers/deck-router';
import { UserRouter } from './routers/user-router';
import express from 'express';

const app = express();

app.use('/', express.json());
app.use('/cards', CardRouter);
app.use('/decks', DeckRouter);
app.use('/users', UserRouter);

app.listen(8080, () => {

    console.log('App running on port 8080');

});

