const express = require('express');
const router = express.Router();
const { Invitation, User, Group } = require('../models');

router.get('/', async (req, res) => {
    try {
        res.json(await User.findAll());
    }
    catch (e) {
        res.json({message: e.error});
    }
});

router.get('/:id', async (req, res) => {
    try {
        res.json(await User.findByPk(req.params.id));
    }
    catch (e) {
        res.json({message: e.error});
    }
});

router.get('/:id/invitations', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        const invitations = await Invitation.findAll({
            where: { email: user.email }
        });
        return res.json(invitations);
    }
    catch (e) {
        res.json({message: e.error});
    }
});



module.exports = router;