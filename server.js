const express = require('express');
const app = express();
const PORT = process.env.PORT;
const path = require('path');
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;
const client = new Client({connectionString});
client.connect();

app.use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs');

app.get('/', (req, res) => res.render('physics/index'))
    .get('/sim', (req, res) => res.render('physics/sim'))
    .get('/highscores', (req, res) => res.render('physics/highscores'))
    .get('/quotes', (req, res) => res.render('physics/quotes'));

app.listen(PORT);
