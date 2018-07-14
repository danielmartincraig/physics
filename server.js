const express = require('express');
const app = express();
const PORT = process.env.PORT;
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs');

app.get('/', (req, res) => res.render('home/index'));

app.listen(PORT);
