const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/secret');

const generateToken = (id) => {
    return jwt.sign({ id }, jwtSecret, { expiresIn: 86400 });
};

module.exports = {
    generateToken
};