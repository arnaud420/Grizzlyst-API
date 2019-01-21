const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/', async (req, res) => {
    try {
        res.json(await models.list.findAll());
    }
    catch (e) {
        res.json({message: e.error});
    }
});

router.get('/:id', async (req, res) => {
    try {
        res.json(await models.list.findByPk(req.params.id));
    }
    catch (e) {
        res.json({message: e.error});
    }
});

router.get('/:id/products', async (req, res) => {
    try {
        const products = await models.list_product.findAll({
            where: { listId: req.params.id },
            include: ['product']
        });
        res.json(products);
    }
    catch (e) {
        res.json({message: e.error});
    }
});

router.post('/', async (req, res) => {
    try {
        if (!req.body.name || !req.body.date || !req.body.groupId) {
            return res.json({message: 'Fields name, date and groupId required'})
        }
        req.body.state = 0;
        const list = await models.list.create(req.body);
        res.json(list);
    }
    catch (e) {
        res.json({message: e.error});
    }
});

module.exports = router;