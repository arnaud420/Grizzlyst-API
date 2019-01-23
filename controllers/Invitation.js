const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/', async (req, res) => {
    try {
        res.json(await models.invitation.findAll());
    }
    catch (e) {
        res.json({message: e.error});
    }
});

router.get('/:id', async (req, res) => {
    try {
        res.json(await models.invitation.findByPk(req.params.id));
    }
    catch (e) {
        res.json({message: e.error});
    }
});

router.post('/:id/group', async (req, res) => {
    try {
        const invitation = await models.invitation.findByPk(req.params.id);

        if (invitation === null) {
            return res.json({message: 'Invitation not found'})
        }

        const group = await invitation.getGroup();
        const user = await models.user.findOne({
            where: { email: invitation.email }
        });

        if (user.id !== req.current_user.id) {
            return res.json({message: 'User is not invited to join this group'});
        }

        await group.addUser(user);
        await invitation.destroy(req.params.id);
        res.json(await group.getUsers());
    }
    catch (e) {
        res.json({message: e.error});
    }
});

module.exports = router;