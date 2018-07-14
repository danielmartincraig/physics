const express = require('express');
const app = express();
const PORT = process.env.PORT;
const path = require('path');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

app.use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs');

app.get('/', (req, res) => res.render('physics/index'))
    .get('/sim', (req, res) => res.render('physics/sim'))
    .get('/highscores', (req, res) => res.render('physics/highscores'))
    .get('/quotes', handleQuotesRequest);

app.listen(PORT);

function handleQuotesRequest(req, res) {
    let quotesQuery = "SELECT quote_text, quote_author FROM quotes";
    pool.query(quotesQuery, function (err, result) {
        if (err) {
            throw err;
        }

        app.locals.quotes = result.rows;
        res.render('physics/quotes');
    });


}