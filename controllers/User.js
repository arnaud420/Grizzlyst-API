const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/', async (req, res) => {
    try {
        res.json(await models.user.findAll());
    }
    catch (e) {
        res.json({message: e.error});
    }
});

router.get('/:id', async (req, res) => {
    try {
        res.json(await models.user.findByPk(req.params.id));
    }
    catch (e) {
        res.json({message: e.error});
    }
});

router.get('/:id/invitations', async (req, res) => {
    try {
        const user = await models.user.findByPk(req.params.id);
        const invitations = await models.invitation.findAll({
            where: { email: user.email }
        });
        return res.json(invitations);
    }
    catch (e) {
        res.json({message: e.error});
    }
});



module.exports = router;