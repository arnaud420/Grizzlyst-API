const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/secret');

const generateToken = (id) => {
    return jwt.sign({ id }, jwtSecret, { expiresIn: 86400 });
};

router.post('/login', async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(401).send('Method not allowed');
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password required');
    }

    try {
        const user = await User.findOne({
            where: { email }
        });

        if (user === null) {
            return res.status(401).send('Bad credentials')
        }

        const hashPassword = await bcrypt.compare(password, user.password);

        if (!hashPassword) {
            return res.status(401).send('Bad credentials');
        }

        const token = generateToken(user.id);

        res.send({
            user,
            token
        })

    }
    catch (e) {
        console.log(e)
    }

});

router.post('/signup', async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(401).send('Method not allowed');
    }

    if (req.body.password !== req.body.confirmPassword) {
        res.status(401).send('Password doesn\'t match');
    }

    try {
        const user = await User.create(req.body);
        const token = generateToken(user.id);
        res.send({
            user,
            token
        });
    }
    catch (e) {
        res.send(e.message);
    }
});

module.exports = router;