const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./models');
const jwt = require('./middlewares/jwt');
const swaggerDoc = require('./helpers/swaggerDoc');
const swaggerUi = require('swagger-ui-express');

db.sequelize.sync();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(jwt);

app.use('/api', require('./routes'));

app.listen(8080);