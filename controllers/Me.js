const express = require('express');
const router = express.Router();
const models = require('../models');
const { generateToken } = require('../helpers/jwt');

/**
 * @swagger
 *
 * /api/me:
 *   get:
 *     tags: [me]
 *     description: Get a user by token bearer
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: return user
 */
router.get('/', async (req, res) => {
    res.json({
        user: req.current_user,
        token: generateToken(req.current_user.id)
    });
});

/**
 * @swagger
 *
 * /api/me/invitations:
 *   get:
 *     tags: [me]
 *     description: Get user's invitations by his token
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: invitations
 */
router.get('/invitations', async (req, res) => {
    try {
        const invitations = await models.invitation.findAll({
            where: { email: req.current_user.email },
            include: ['group']
        });
        return res.json(invitations);
    }
    catch (e) {
        res.json({message: e.error});
    }
});

/**
 * @swagger
 *
 * /api/me/groups:
 *   get:
 *     tags: [me]
 *     description: Get user's groups by his token
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: groups
 */
router.get('/groups', async (req, res) => {
    try {
        const groups = await req.current_user.getGroups();
        res.json(groups);
    }
    catch (e) {
        res.json({message: e.error});
    }
});

module.exports = router;