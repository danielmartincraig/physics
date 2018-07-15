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
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: true}))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs');

app.get('/', (req, res) => res.render('physics/index'))
    .get('/quotes', handleQuotesRequest);

app.get('/sim', handleTrajectoriesRequest)
    .post('/sim', (req, res) => {
        console.log("Hello");
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

        let velocity = encodeURI(req.body.velocity);
        let launchAngle = encodeURI(req.body.launchAngle);

        let myInsert = `INSERT INTO trajectories (shot_angle, shot_velocity) VALUES ( ${launchAngle}, ${velocity})`;
        console.log(myInsert);

        pool.query(myInsert, function (err, result) {
            if (err) {

            }
            handleTrajectoriesRequest(req, res);
        });
    });

app.use(function (req, res) {
    res.send(404);
});

app.listen(PORT);

function handleTrajectoriesRequest(req, res) {
    let trajectoriesQuery = "SELECT DISTINCT shot_angle, shot_velocity FROM trajectories LIMIT 10";

    pool.query(trajectoriesQuery, function (err, result) {
        if (err) {

        }
        else {
            app.locals.trajectories = result.rows;
        }

        res.render('physics/sim');
    });
}

function handleHighScoresRequest(req, res) {
    let highScoresQuery = "SELECT final_distance, player_initials FROM highscores h INNER JOIN trajectories t " +
        "ON h.trajectory_id = t.id";
    pool.query(highScoresQuery, function (err, result) {
        if (err) {
            throw err;
        }
        app.locals.highscores = result.rows;
        res.render('physics/highscores');
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
