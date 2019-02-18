const express = require('express');
const router = express.Router();
const models = require('../models');

/**
 * @swagger
 *
 * /api/favorites:
 *   get:
 *     tags: [favorites]
 *     description: Get all favorites
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: favorites
 */
router.get('/', async (req, res) => {
    try {
        res.json(await models.favorite.findAll());
    }
    catch (e) {
        res.json({message: e.error});
    }
});

/**
 * @swagger
 *
 * /api/favorites/:id:
 *   get:
 *     tags: [favorites]
 *     description: Get favorite by id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: favorite
 */
router.get('/:id', async (req, res) => {
    try {
        res.json(await models.favorite.findByPk(req.params.id));
    }
    catch (e) {
        res.json({message: e.error});
    }
});

module.exports = router;