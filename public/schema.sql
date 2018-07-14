DROP TABLE highscores;
DROP TABLE quotes;
DROP TABLE trajectories;

CREATE TABLE trajectories
( id SERIAL PRIMARY KEY
, shot_angle INTEGER
, shot_velocity INTEGER
, duration INTEGER
, final_distance INTEGER
);

CREATE TABLE highscores
( id SERIAL PRIMARY KEY
, trajectory_id INTEGER REFERENCES trajectories(id)
, player_initials VARCHAR(3)
);

CREATE TABLE quotes
( id SERIAL PRIMARY KEY
, quote_text TEXT
, quote_author TEXT
);

