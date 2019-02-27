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

module.exports = router;