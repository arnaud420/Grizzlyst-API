const express = require('express');
const router = express.Router();
const models = require('../models');
const GLMail = require('../helpers/GLMail');

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
        if (!req.body.name || !req.body.adminId) {
            return res.json({message: 'Name and adminId required'})
        }

        const admin = await models.user.findByPk(req.body.adminId);

        if (admin === null) {
            return res.json({message: 'User not found'});
        }

        const group = await models.group.create(req.body);

        await group.addUser(admin);

        res.json(group);
    }
    catch (e) {
        res.json({message: e.message});
    }
});

router.post('/:id/user/add', async (req, res) => {
    try {
        const { email } = req.body;

        const group = await models.group.findByPk(req.params.id);

        if (group === null) {
            return res.json({message: 'Group not found'});
        }

        if (!email) {
            return res.json({message: 'Email required'});
        }

        const admin = await models.user.findByPk(group.adminId);

        if (admin === null) {
            return res.json({message: 'Admin not found'});
        }

        if (admin.email === email) {
            return res.json({message: 'Admin already in group'})
        }

        const user = await models.user.findOne({
            where: { email }
        });

        if (user === null) {
            const userInvitation = await models.invitation.findAll({
                where: {
                    email,
                    groupId: group.id
                }
            });

            if (userInvitation.length >= 1) {
                return res.json({errorMessage: 'User already invited to join this group'})
            }

            const msg = 'Invitation à télécharger l\'application GrizzLyst';
            try {
                await GLMail.sendMail(email, `Demande d'inscription au groupe ${group.name}`, msg);
            } catch (e) {
                res.json({error: e.message})
            }

            await models.invitation.create({
                email,
                groupId: group.id
            });
            return res.json({message: 'Mail send with success'});
        }

        await models.invitation.create({
            email,
            groupId: group.id
        });

        const groupUsers = await group.getUsers();

        res.json({
            message: 'Invitation send with success',
            groupUsers
        });

    }
    catch (e) {
        res.json({message: e.message})
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