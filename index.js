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
app.use('/users', require('./controllers/User'));
app.use('/groups', require('./controllers/Group'));
// app.use('/departments', require('./controllers/Department'));
// app.use('/products', require('./controllers/Product'));
// app.use('/lists', require('./controllers/List'));
app.use('/auth', require('./controllers/Auth'));

app.listen(8080);