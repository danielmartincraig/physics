const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;
const path = require('path');
const { Pool } = require('pg');
const { sanitizeBody } = require('express-validator/filter');
const { body,validationResult } = require('express-validator/check');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

app.use(express.static(path.join(__dirname, 'public')))
    .use(require('sanitize').middleware)
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: true}))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs');

app.get('/', (req, res) => res.render('physics/index'))
    .post('/quotes', (req, res) => {
        let quote_text = req.bodyString('quote_text');
        let quote_author = req.bodyString('quote_author');

        let myInsert = `INSERT INTO quotes (quote_text, quote_author, creation_date, creation_time) VALUES ('${quote_text}', '${quote_author}', current_date, current_time)`;

        pool.query(myInsert, function (err, result) {
            if (err) {

            }
            handleQuotesRequest(req, res);
        });
    })
    .get('/quotes', handleQuotesRequest);

app.get('/sim', handleTrajectoriesRequest)
    .post('/sim', (req, res) => {
        /*sanitizeBody(req.body, (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                //there are errors
                console.log("There are errors");
            }
            else {
                let velocity = req.body.velocity;
                let launchAngle = req.body.launchAngle;

                console.log("Velocity = " + velocity);

                let myInsert = `INSERT INTO trajectories (shot_angle, shot_velocity) VALUES ( ${launchAngle}, ${velocity})`;
                console.log(myInsert);

                pool.query(myInsert, function (err, result) {
                    if (err) {
                        throw err;
                    }
                })
            }
        }).escape();*/

        let velocity = req.bodyString('velocity');
        let launchAngle = req.bodyString('launchAngle');

        let myInsert = `INSERT INTO trajectories (shot_angle, shot_velocity, creation_date, creation_time) VALUES ( ${launchAngle}, ${velocity}, current_date, current_time)`;
        console.log(myInsert);

        pool.query(myInsert, function (err, result) {
            if (err) {

            }
            handleTrajectoriesRequest(req, res);
        });
    })
    .delete('/sim', handleClearTrajectoriesRequest);

app.use(function (req, res) {
    res.send(404);
});

app.listen(PORT);

function handleTrajectoriesRequest(req, res) {
    let trajectoriesQuery = "SELECT DISTINCT shot_angle, shot_velocity, creation_date, creation_time FROM trajectories ORDER BY creation_date, creation_time DESC LIMIT 10";

    pool.query(trajectoriesQuery, function (err, result) {
        if (err) {
        }
        else {
            app.locals.trajectories = result.rows;
        }

        res.render('physics/sim');
    });
}

function handleClearTrajectoriesRequest(req, res) {
    let clearTrajectoriesString = "TRUNCATE trajectories CASCADE";

    pool.query(clearTrajectoriesString, function (err, result) {
        if (err) {
        }

        res.render('physics/sim');
    });
}

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
