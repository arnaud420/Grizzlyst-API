const express = require('express');
const router = express.Router();
const { Invitation, User, Group } = require('../models');

router.get('/', async (req, res) => {
    res.send('Hello user!')
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