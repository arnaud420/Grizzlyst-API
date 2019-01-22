const express = require('express');
const router = express.Router();
const models = require('../models');
const GLMail = require('../helpers/GLMail');
const { createInvitationObj } = require('../helpers/group');

router.get('/', async (req, res) => {
    try {
        const groups = await models.group.findAll();
        res.json(groups);
    }
    catch (e) {
        res.json({message: e.message});
    }
});

router.get('/:id', async (req, res) => {
    try {
        const group = await models.group.findByPk(req.params.id);

        if (group === null) {
            return res.json({message: 'No group found'});
        }

        res.json(group);
    }
    catch (e) {
        res.json({message: e.message});
    }
});

router.get('/:id/users', async (req, res) => {
    try {
        const group = await models.group.findByPk(req.params.id);

        if (group === null) {
            return res.json({message: 'No group found'});
        }

        const users = await models.group.getUsers();

        res.json({group, users});
    }
    catch (e) {
        res.json({message: e.message});
    }
});

router.get('/:id/lists', async (req, res) => {
    try {
        const group = await models.group.findByPk(req.params.id);

        if (group === null) {
            return res.json({message: 'No group found'});
        }

        const lists = await models.list.findAll({
            where: { groupId: group.id }
        });

        res.json({group, lists});
    }
    catch (e) {
        res.json({message: e.message});
    }
});

router.post('/', async (req, res) => {
    try {
        const { current_user } = req;

        if (!req.body.name) {
            return res.json({message: 'Name required'})
        }

        req.body.adminId = req.current_user.id;

        const group = await models.group.create(req.body);

        await group.addUser(current_user);

        res.json(group);
    }
    catch (e) {
        res.json({message: e.message});
    }
});

router.post('/:id/users', async (req, res) => {
    const { emails } = req.body;

    const group = await models.group.findByPk(req.params.id);

    if (group === null) {
        return res.json({message: 'Group not found'});
    }

    const admin = await models.user.findByPk(group.adminId);

    if (!emails || !Array.isArray(emails)) {
        return res.json({message: 'Array of emails required'});
    }

    if (emails.includes(admin.email)) {
        emails.splice(emails.indexOf(admin.email), 1);
    }

    try {
        await GLMail.sendMultipleInvitations(emails, group);
        await models.invitation.bulkCreate(createInvitationObj(emails, group.id));
        return res.json({message: 'Invitation send with success'});
    }
    catch (e) {
        return res.json({message: e.message});
    }
});

router.put('/:id', async (req, res) => {
    try {
        if (req.body.adminId) {
            return res.json({message: 'Admin can not be modified'})
        }

        await models.group.update(req.body, {
            where: { id: req.params.id }
        });

        res.json({message: 'Group update with success'});
    }
    catch (e) {
        res.json({message: e.message});
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const group = await models.group.findOne({
            where: { id: req.params.id }
        });

        if (group === null) {
            return res.json({message: 'Group not found'});
        }

        const admin = await models.user.findByPk(group.adminId);

        if (req.body.adminId !== admin.id) {
            return res.json({message: 'You are not allowed to delete'});
        }
        else {
            await group.destroy();
            return res.json({message: 'Group destroy with success'});
        }
    }
    catch (e) {
        res.json({message: e.message});
    }
});

router.delete('/:id/user/:userId', async (req, res) => {
    try {
        const group = await models.group.findByPk(req.params.id);

        if (group === null) {
            return res.json({message: 'Group not found'});
        }

        if (req.current_user === group.adminId) {
            return res.json({message: 'Admin can\t remove himself from group'});
        }

        await group.removeUser(req.params.userId);

        const usersGroup = await group.getUsers();

        res.json({
            group,
            usersGroup
        });
    }
    catch (e) {
        res.json({message: e.message});
    }
});

module.exports = router;