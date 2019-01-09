const express = require('express');
const router = express.Router();
const { Group, User } = require('../models');

router.get('/', async (req, res) => {
    try {
        const groups = await Group.findAll();
        res.json(groups);
    }
    catch (e) {
        res.json({message: e.message});
    }
});

router.get('/:id', async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);

        // if (group === undefined) {
        //     return res.json('Aucun groupe trouvé');
        // }

        res.json(group);
    }
    catch (e) {
        res.json({message: e.message});
    }
});

router.post('/', async (req, res) => {
    try {
        if (!req.body.name || !req.body.adminId) {
            return res.json({message: 'Name and adminId required'})
        }

        const admin = await User.findById(req.body.adminId);

        if (admin === null) {
            return res.json({message: 'User not found'});
        }

        const group = await Group.create(req.body);

        group.addUser(admin);

        res.json(group);
    }
    catch (e) {
        res.json({message: e.message});
    }
});

router.post('/:id/user/add', async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);

        if (group === null) {
            return res.json({message: 'Group not found'});
        }

        const admin = await User.findById(group.adminId);

        if (admin === null) {
            return res.json({message: 'User not found'});
        }

        if (!req.body.email) {
            return res.json({message: 'Email required'});
        }

        const user = await User.findOne({
            where: { email: req.body.email }
        });

        if (user === null) {
            return res.json({message: 'User not found'});
        }

        group.addUser(user);

        res.json(await group.getUsers());

    }
    catch (e) {
        res.json({message: e.message})
    }
});

router.put('/:id', async (req, res) => {
    try {
        const group = await Group.update(req.body, {
            where: { id: req.params.id }
        });
        res.json(group);
    }
    catch (e) {
        res.json({message: e.message});
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        await Group.destroy({
            where: { id: req.params.id }
        });
        res.sendStatus(202);
    }
    catch (e) {
        res.json({message: e.message});
    }
});

module.exports = router;