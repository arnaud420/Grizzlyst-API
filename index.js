const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { sequelize } = require('./models');

sequelize.sync();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use('/users', require('./controllers/User'));
// app.use('/groups', require('./controllers/Group'));
// app.use('/departments', require('./controllers/Department'));
// app.use('/products', require('./controllers/Product'));
// app.use('/lists', require('./controllers/List'));
app.use('/auth', require('./controllers/Auth'));

app.listen(8080);