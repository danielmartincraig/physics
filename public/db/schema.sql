DROP TABLE highscores;
DROP TABLE quotes;
DROP TABLE trajectories;

CREATE TABLE trajectories
( id SERIAL PRIMARY KEY
, shot_angle INTEGER NOT NULL
, shot_velocity INTEGER NOT NULL
, creation_date DATE NOT NULL
, creation_time TIME NOT NULL
);

CREATE TABLE highscores
( id SERIAL PRIMARY KEY
, trajectory_id INTEGER REFERENCES trajectories(id)
, player_initials VARCHAR(3)
, duration INTEGER
, final_distance INTEGER
, creation_date DATE NOT NULL
, creation_time TIMES NOT NULL
);

CREATE TABLE quotes
( id SERIAL PRIMARY KEY
, quote_text TEXT
, quote_author TEXT
, creation_date DATE NOT NULL
, creation_time TIME NOT NULL
);

