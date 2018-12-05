const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { sequelize } = require('./models');

sequelize.sync();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    res.send('Hello World!')
});

app.listen(8080);