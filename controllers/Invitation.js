const express = require('express');
const router = express.Router();
const { Invitation, User, Group } = require('../models');

router.get('/:id', async (req, res) => {
    try {
        const invitation = await Invitation.findByPk(req.params.id);
        return res.json(invitation);
    }
    catch (e) {
        res.json({message: e.error});
    }
});

router.get('/:id/group/join', async (req, res) => {
    try {
        const invitation = await Invitation.findByPk(req.params.id);
        const group = await invitation.getGroup();
        const user = await User.findOne({
            where: { email: invitation.email }
        });
        await group.addUser(user);
        await invitation.destroy(req.params.id);
        res.json(await group.getUsers());
    }
    catch (e) {
        res.json({message: e.error});
    }
});

module.exports = router;