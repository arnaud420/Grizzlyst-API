const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const jwt = require('./middlewares/jwt');

sequelize.sync();

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(jwt);

// Routes
app.use('/api', require('./routes'));

app.listen(8080);