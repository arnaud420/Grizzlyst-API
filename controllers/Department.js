const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/', async (req, res) => {
    try {
        res.json(await models.department.findAll());
    }
    catch (e) {
        res.json({message: e.error});
    }
});

router.get('/:id', async (req, res) => {
    try {
        res.json(await models.department.findByPk(req.params.id));
    }
    catch (e) {
        res.json({message: e.error});
    }
});

router.post('/', async (req, res) => {
    try {
        if (!req.body.name) {
            return res.json({message: 'Fields name required'})
        }
        const department = await models.department.create(req.body);
        res.json(department);
    }
    catch (e) {
        res.json({message: e.error});
    }
});

router.put('/:id', async (req, res) => {
    try {
        await models.department.update(req.body, {
            where: { id: req.params.id }
        });

        res.json({message: 'Department updated with success'});
    }
    catch (e) {
        res.json({message: e.message});
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const department = await models.department.findOne({
            where: { id: req.params.id }
        });

        if (department === null) {
            return res.json({message: 'Department not found'});
        }

        await department.destroy();
        return res.json({message: 'Department destroy with success'});
    }
    catch (e) {
        res.json({message: e.message});
    }
});



module.exports = router;