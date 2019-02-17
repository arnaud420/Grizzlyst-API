const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition: {
        info: {
            title: 'Grizzlyst API Documentation',
            version: '1.0.0',
        },
    },
    apis: ['./controllers/*'],
};

module.exports = swaggerJSDoc(options);