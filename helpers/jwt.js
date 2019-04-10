const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/secret');

const generateToken = (id) => {
    return jwt.sign({ id }, jwtSecret, { expiresIn: "30 days" });
};

module.exports = {
    generateToken
};