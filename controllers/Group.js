const express = require('express');
const router = express.Router();
const models = require('../models');
const GLMail = require('../helpers/GLMail');
const { createInvitationObj } = require('../helpers/group');

/**
 * @swagger
 *
 * /api/groups:
 *   get:
 *     tags: [groups]
 *     description: Get all groups
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: groups
 */
router.get('/', async (req, res) => {
    try {
        const groups = await models.group.findAll();
        res.json(groups);
    }
    catch (e) {
        res.json({message: e.message});
    }
});

/**
 * @swagger
 *
 * /api/groups/:id:
 *   get:
 *     tags: [groups]
 *     description: Get group by id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: groups
 */
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

/**
 * @swagger
 *
 * /api/groups/:id/users:
 *   get:
 *     tags: [groups]
 *     description: Get users belongs to a group
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: group, users
 */
router.get('/:id/users', async (req, res) => {
    try {
        const group = await models.group.findByPk(req.params.id);

        if (group === null) {
            return res.json({message: 'No group found'});
        }

        const users = await group.getUsers();

        res.json({group, users});
    }
    catch (e) {
        res.json({message: e.message});
    }
});

/**
 * @swagger
 *
 * /api/groups/:id/lists:
 *   get:
 *     tags: [groups]
 *     description: Get lists belongs to a group
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: group, lists
 */
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

/**
 * @swagger
 *
 * /api/groups/:id/no-buy-products:
 *   get:
 *     tags: [groups]
 *     description: Get non buy products from group by list
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: lists
 */
router.get('/:id/no-buy-products', async (req, res) => {
    try {
        const group =  await models.group.findByPk(req.params.id);
        if (group === null) {
            return res.json({message: 'No group found'});
        }
        // get finished lists
        const lists = await models.list.findAll({
            where: {
                groupId: group.id,
                state: 3
            },
            include: [{
                model: models.list_product,
                where: {
                    state: 0
                },
                include: [{
                    model: models.product
                }]
            }]
        });
        res.json(lists);
    }
    catch (e) {
        res.json({message: e.error});
    }
});

/**
 * @swagger
 *
 * /api/groups/:id/favorite/products:
 *   get:
 *     tags: [groups]
 *     description: Get favorites group's products
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: group, favorites
 */
router.get('/:id/favorite/products', async (req, res) => {
    try {
        const group = await models.group.findByPk(req.params.id);
        if (group === null) {
            return res.json({message: 'No group found'});
        }
        const favorites = await group.getProducts();
        res.json({group, favorites});
    }
    catch (e) {
        res.json({message: e.message});
    }
});

/**
 * @swagger
 *
 * /api/groups/:id/favorite/products:
 *   post:
 *     tags: [groups]
 *     description: Insert a product in group's favorite
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: productId
 *         description: Product id
 *         in: formData
 *         required: true
 *         type: int
 *     responses:
 *       200:
 *         description: group, favorites
 */
router.post('/:id/favorite/products', async (req, res) => {
    try {
        const group = await models.group.findByPk(req.params.id);
        if (group === null) {
            return res.json({message: 'No group found'});
        }
        const favorites = await models.favorite_product.create({
            groupId: req.params.id,
            productId: req.body.productId
        });
        res.json({group, favorites});
    }
    catch (e) {
        res.json({message: e.message});
    }
});

/**
 * @swagger
 *
 * /api/groups:
 *   post:
 *     tags: [groups]
 *     description: Create a new group
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: name
 *         description: Name for the group
 *         in: formData
 *         required: true
 *         type: string
 *       - name: emails
 *         description: Emails array for send invitation to users
 *         in: formData
 *         required: true
 *         type: array
 *     responses:
 *       200:
 *         description: Invitation send with success
 */
router.post('/', async (req, res) => {
    const admin = req.current_user;
    const { name, emails } = req.body;

    if (!name) {
        return res.json({message: 'Name required'})
    }
    if (!emails || !Array.isArray(emails)) {
        return res.json({message: 'Array of emails required'});
    }

    try {
        const group = await models.group.create({
            adminId: admin.id,
            name
        });
        await group.addUser(admin);

        if (emails.includes(admin.email)) {
            emails.splice(emails.indexOf(admin.email), 1);
        }

        await GLMail.sendMultipleInvitations(emails, group);
        await models.invitation.bulkCreate(createInvitationObj(emails, group.id));
        return res.json(group);

    }
    catch (e) {
        res.json({message: e.message});
    }
});

/**
 * @swagger
 *
 * /api/groups/:id/users:
 *   post:
 *     tags: [groups]
 *     description: Create a new group
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: emails
 *         description: Emails array for send invitation to users
 *         in: formData
 *         required: true
 *         type: array
 *     responses:
 *       200:
 *         description: send invitation by mail
 *       500:
 *         Emails already exists for this group invitation
 */
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

    const emailsAlreadyExists = await models.invitation.findAll({
        where: {
            groupId: req.params.id,
            email: { [models.Sequelize.Op.in]: emails }
        }});

    if (emailsAlreadyExists.length) {
        return res.json({
            error: "Email already send",
            emails: emailsAlreadyExists
        });
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

/**
 * @swagger
 *
 * /api/groups/:id:
 *   put:
 *     tags: [groups]
 *     description: Update a group
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: group
 */
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

/**
 * @swagger
 *
 * /api/groups/:id:
 *   delete:
 *     tags: [groups]
 *     description: Delete a group
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: group
 */
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

/**
 * @swagger
 *
 * /api/groups/:id/user/:userId:
 *   delete:
 *     tags: [groups]
 *     description: Remove a user from a group
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: group, usersGroup
 */
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