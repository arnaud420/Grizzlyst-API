const express = require('express');
const router = express.Router();
const { User, List, Group } = require('../models');

router.get('/', async (req, res) => {
    try {
        res.json(await List.findAll());
    }
    catch (e) {
        res.json({message: e.error});
    }
});

router.get('/:id', async (req, res) => {
    try {
        res.json(await List.findByPk(req.params.id));
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
        const list = await List.create(req.body);
        res.json(list);
    }
    catch (e) {
        res.json({message: e.error});
    }
});

module.exports = router;