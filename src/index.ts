import express from 'express';
import dotenv from 'dotenv';
import {CardRouter} from './routers/card-router';
import {DeckRouter} from './routers/deck-router';
import { UserRouter } from './routers/user-router';
import { Pool } from 'pg';

dotenv.config();

export const connectionPool: Pool = new Pool({

    host: process.env['DB_HOST'],
    port: +process.env['DB_PORT'],
    database: process.env['DB_NAME'],
    user: process.env['DB_USERNAME'],
    password: process.env['DB_PASSWORD'],
    max: 5

});

const app = express();

app.use('/', express.json());
app.use('/cards', CardRouter);
app.use('/decks', DeckRouter);
app.use('/users', UserRouter);

app.listen(8080, () => {

    console.log('App running on port 8080');

});

