const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/secret');
const models = require('../models');

const ignoredRoutes = [
    '/api/auth/login',
    '/api/auth/signup'
];

const jwtMiddleware = (req, res, next) => {
    if (ignoredRoutes.indexOf(req.url) !== -1) {
        return next();
    }

    if (req.headers.authorization === undefined) {
        return res.send({message: 'No authorization header found'});
    }

    const parts = req.headers.authorization.split(' ');

    if (parts.length !== 2) {
        return res.send({message: 'Format is Authorization: Bearer [token]'});
    }

    const token = parts[1];

    jwt.verify(token, jwtSecret, async (err, decoded) => {
        if (err) {
            return res.status(500).send({message: 'Failed to authenticate token'});
        }

        req.current_user = await models.user.findOne({
            where: { id: decoded.id }
        });

        return next();
    });
};

module.exports = jwtMiddleware;