const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const models = require('../models');
const { generateToken } = require('../helpers/jwt');

/**
 * @swagger
 *
 * /api/auth/login:
 *   post:
 *     tags: [auth]
 *     description: Login to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: Email to use for login.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: user, token
 */
router.post('/login', async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(401).send({message: 'Method not allowed'});
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({message: 'Email and password required'});
    }

    try {
        const user = await models.user.findOne({
            where: { email }
        });

        if (user === null) {
            return res.status(401).send({message: 'Bad credentials'})
        }

        const hashPassword = await bcrypt.compare(password, user.password);

        if (!hashPassword) {
            return res.status(401).send({message: 'Bad credentials'});
        }

        const token = generateToken(user.id);

        res.send({
            user,
            token
        });

    }
    catch (e) {
        res.json({message: e.message});
    }

});

/**
 * @swagger
 *
 * /api/auth/signup:
 *   post:
 *     tags: [auth]
 *     description: Signup to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: Email to use for login.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: firstname
 *         description: User's firstname.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: lastname
 *         description: User's lastname.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: pseudo
 *         description: User's pseudo.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: confirmPassword
 *         description: User's confirmation password.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: user, token
 */
router.post('/signup', async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(401).send({message: 'Method not allowed'});
    }

    if (req.body.password !== req.body.confirmPassword) {
        return res.status(401).send({message: 'Password doesn\'t match'});
    }

    if (!req.body.firstname || !req.body.name || !req.body.pseudo) {
        return res.status(401).send({message: 'Firstname, name and pseudo required'});
    }

    try {
        const user = await models.user.create(req.body);
        const token = generateToken(user.id);
        res.send({
            user,
            token
        });
    }
    catch (e) {
        res.json({message: e.message});
    }
});

module.exports = router;