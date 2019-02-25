const express = require('express');
const router = express.Router();
const models = require('../models');

/**
 * @swagger
 *
 * /api/users:
 *   get:
 *     tags: [users]
 *     description: Get all users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: users
 */
router.get('/', async (req, res) => {
    try {
        res.json(await models.user.findAll());
    }
    catch (e) {
        res.json({message: e.error});
    }
});

/**
 * @swagger
 *
 * /api/users:
 *   get:
 *     tags: [users]
 *     description: Get a user by id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: user
 */
router.get('/:id', async (req, res) => {
    try {
        res.json(await models.user.findByPk(req.params.id));
    }
    catch (e) {
        res.json({message: e.error});
    }
});

/**
 * @swagger
 *
 * /api/users/me:
 *   post:
 *     tags: [users]
 *     description: Get a user by token bearer
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: user
 */
router.post('/me', async (req, res) => {
    res.json(req.current_user);
});

/**
 * @swagger
 *
 * /api/users/:id/invitations:
 *   get:
 *     tags: [users]
 *     description: Get user's invitations
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: invitations
 */
router.get('/:id/invitations', async (req, res) => {
    try {
        const invitations = await models.invitation.findAll({
            where: { email: req.current_user.email }
        });
        return res.json(invitations);
    }
    catch (e) {
        res.json({message: e.error});
    }
});



module.exports = router;