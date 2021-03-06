const express = require('express');
const router = express.Router();
const models = require('../models');

/**
 * @swagger
 *
 * /api/invitations:
 *   get:
 *     tags: [invitations]
 *     description: Get all invitations
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: invitations
 */
router.get('/', async (req, res) => {
    try {
        res.json(await models.invitation.findAll());
    }
    catch (e) {
        res.json({message: e.error});
    }
});

/**
 * @swagger
 *
 * /api/invitations/:id:
 *   get:
 *     tags: [invitations]
 *     description: Get invitation by id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: invitation
 */
router.get('/:id', async (req, res) => {
    try {
        res.json(await models.invitation.findByPk(req.params.id));
    }
    catch (e) {
        res.json({message: e.error});
    }
});

/**
 * @swagger
 *
 * /api/invitations/:id/group:
 *   post:
 *     tags: [invitations]
 *     description: Join a group by user invitation
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: invitations
 */
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

/**
 * @swagger
 *
 * /api/invitations/:id:
 *   delete:
 *     tags: [invitations]
 *     description: Delete invitation
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: invitation destroy
 */
router.delete('/:id', async (req, res) => {
    try {
        const invitation = await models.invitation.findOne({
            where: { id: req.params.id }
        });

        if (invitation === null) {
            return res.json({message: 'Invitation not found'});
        }

        await invitation.destroy();
        return res.json({message: 'Invitation destroy with success'});
    }
    catch (e) {
        res.json({message: e.message});
    }
});

module.exports = router;