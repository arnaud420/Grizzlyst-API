const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');

router.get('/login', async (req, res, next) => {
    res.send('Hello login!')
});

router.post('/signup', async (req, res, next) => {
    if (req.method !== 'POST') {
        res.status(401).send('Method not allowed');
    }

    if (req.body.password !== req.body.confirmPassword) {
        res.status(401).send('Password doesn\'t match');
    }

    try {
        const user = await User.create(req.body);
        res.send(user);
    }
    catch (e) {
        res.send(e.message);
    }

});

module.exports = router;