const express = require('express');
const router = express.Router();
const models = require('../models');
const { openFoodFactsClient } = require('../helpers/Client');

router.get('/', async (req, res) => {
    try {
        res.json(await models.list.findAll());
    }
    catch (e) {
        res.json({message: e.error});
    }
});

router.get('/:id', async (req, res) => {
    try {
        res.json(await models.list.findByPk(req.params.id));
    }
    catch (e) {
        res.json({message: e.error});
    }
});

router.get('/:id/products', async (req, res) => {
    try {
        const products = await models.list_product.findAll({
            where: { listId: req.params.id },
            include: ['product']
        });
        res.json(products);
    }
    catch (e) {
        res.json({message: e.error});
    }
});

router.get('/:id/departments', async (req, res) => {
    try {
        const list = await models.list.findOne({
            where: { id: req.params.id }
        });
        const departments = await list.getDepartments();
        res.json({
            list,
            departments
        });
    }
    catch (e) {
        res.json({message: e.error});
    }
});

router.post('/', async (req, res) => {
    try {
        if (!req.body.name || !req.body.date || !req.body.groupId || !req.body.departments) {
            return res.json({message: 'Fields name, date, departments and groupId required'})
        }
        req.body.state = 0;
        const list = await models.list.create(req.body);

        await list.addDepartments(req.body.departments);

        res.json(list);
    }
    catch (e) {
        res.json({message: e.error});
    }
});

router.post('/:id/product', async (req, res) => {
    let product = null;

    const { _id, departmentId } = req.body;

    if (!_id || !departmentId) {
        return res.json({message: 'Fields _id and departmentId required'})
    }

    product = await models.product.findOne({
        where: { _id }
    });

    if (product === null) {
        try {
            product = await openFoodFactsClient.getProduct(_id);
            product = await models.product.create(product);
        }
        catch (e) {
            return res.json(e);
        }
    }

    try {
        const listProduct = await models.list_product.create({
            productId: product.id,
            listId: req.params.id,
            departmentId: departmentId
        });

        return res.json({
            message: 'Product add to list with success',
            listProduct
        })
    }
    catch (e) {
        return res.json(e);
    }
});

module.exports = router;