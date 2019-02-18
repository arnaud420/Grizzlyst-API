const express = require('express');
const router = express.Router();
const models = require('../models');
const { openFoodFactsClient } = require('../helpers/Client');
const { getProductsFromDepartment } = require('../helpers/list');

/**
 * @swagger
 *
 * /api/lists:
 *   get:
 *     tags: [lists]
 *     description: Get all lists
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: lists
 */
router.get('/', async (req, res) => {
    try {
        res.json(await models.list.findAll());
    }
    catch (e) {
        res.json({message: e.error});
    }
});

/**
 * @swagger
 *
 * /api/lists/:id:
 *   get:
 *     tags: [lists]
 *     description: Get list by id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: list
 */
router.get('/:id', async (req, res) => {
    try {
        res.json(await models.list.findByPk(req.params.id));
    }
    catch (e) {
        res.json({message: e.error});
    }
});

/**
 * @swagger
 *
 * /api/lists/:id/products:
 *   get:
 *     tags: [lists]
 *     description: Get products belongs to a list
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: products
 */
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

/**
 * @swagger
 *
 * /api/lists/:id/departments/products:
 *   get:
 *     tags: [lists]
 *     description: Get products order by departments belongs to a list
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: productsDepartments
 */
router.get('/:id/departments/products', async (req, res) => {
    try {
        const productsDepartments = await getProductsFromDepartment(req.params.id);
        res.json(productsDepartments);
    }
    catch (e) {
        res.json({message: e});
    }
});

/**
 * @swagger
 *
 * /api/lists:
 *   post:
 *     tags: [lists]
 *     description: Create a new list
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: name
 *         description: Name for the list
 *         in: formData
 *         required: true
 *         type: string
 *       - name: date
 *         description: beginning date of list
 *         in: formData
 *         required: true
 *         type: date
 *       - name: groupId
 *         description: groupId belong to list
 *         in: formData
 *         required: true
 *         type: int
 *       - name: departments
 *         description: Array of department ids
 *         in: formData
 *         required: true
 *         type: array
 *     responses:
 *       200:
 *         description: list, departments
 */
router.post('/', async (req, res) => {
    try {
        if (!req.body.name || !req.body.date || !req.body.groupId || !req.body.departments) {
            return res.json({message: 'Fields name, date, departments and groupId required'})
        }
        req.body.state = 0;
        const list = await models.list.create(req.body);

        await list.addDepartments(req.body.departments);

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

/**
 * @swagger
 *
 * /api/lists/:id/department:
 *   post:
 *     tags: [lists]
 *     description: Add a new department to list
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: departmentId
 *         description: add department to list
 *         in: formData
 *         required: true
 *         type: int
 *     responses:
 *       200:
 *         description: departments
 */
router.post('/:id/department', async (req, res) => {
    try {
        const list = await models.list.findByPk(req.params.id);

        if (!req.body.departmentId) {
            return res.json({message: 'Field departmentId required'});
        }

        list.addDepartment(req.body.departmentId);

        res.json(await list.getDepartments());
    }
    catch (e) {
        res.json({message: e.error});
    }
});

/**
 * @swagger
 *
 * /api/lists/:id/department/:departmentId/product:
 *   post:
 *     tags: [lists]
 *     description: Add a new product to a department belongs to a list.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: Product _id from openFoodFact API
 *         in: formData
 *         required: true
 *         type: int
 *     responses:
 *       200:
 *         description: listProduct
 */
router.post('/:id/department/:departmentId/product', async (req, res) => {
    let product = null;

    const { _id } = req.body;

    if (!_id) {
        return res.json({message: 'Fields _id required'})
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
            departmentId: req.params.departmentId,
            quantity: req.body.quantity,
            state: 0
        });

        return res.json({
            message: 'Product add to list with success',
            listProduct
        })
    }
    catch (e) {
        return res.status(500).json(e);
    }
});

router.put('/:id', async (req, res) => {
    try {
        await models.list.update(req.body, {
            where: { id: req.params.id }
        });

        return res.json({message: 'List updated with success'});
    }
    catch (e) {
        res.json({message: e.message});
    }
});

/**
 * @swagger
 *
 * /api/lists/:id/product/:productId:
 *   put:
 *     tags: [lists]
 *     description: Update list_product table.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: listProduct
 */
router.put('/:id/product/:productId', async (req, res) => {
    try {
        await models.list_product.update(req.body, {
            where: {
                listId: req.params.id,
                productId: req.params.productId
            }
        });
        const product = await models.list_product.findOne({
            where: {
                listId: req.params.id,
                productId: req.params.productId
            }
        });
        return res.json({
            message: 'Product quantity updated with success',
            product
        });
    }
    catch (e) {
        res.json({message: e.message});
    }
});

/**
 * @swagger
 *
 * /api/lists/:id:
 *   delete:
 *     tags: [lists]
 *     description: Delete a list
 *     produces:
 *       - application/json
 */
router.delete('/:id', async (req, res) => {
    try {
        const list = await models.list.findOne({
            where: { id: req.params.id }
        });

        if (list === null) {
            return res.json({message: 'List not found'});
        }

        await list.destroy();
        return res.json({message: 'List destroy with success'});

    }
    catch (e) {
        res.json({message: e.message});
    }
});

/**
 * @swagger
 *
 * /api/lists/:id/department/:departmentId:
 *   delete:
 *     tags: [lists]
 *     description: Remove a department from a list
 *     produces:
 *       - application/json
 */
router.delete('/:id/department/:departmentId', async (req, res) => {
    try {
        const list = await models.list.findOne({
            where: { id: req.params.id }
        });

        list.removeDepartment(req.params.departmentId);

        return res.json({
            message: 'Department remove from list with success',
            list: await list.getDepartments()
        });
    }
    catch (e) {
        res.json({message: e.message});
    }
});

/**
 * @swagger
 *
 * /api/lists/:id/department/:departmentId/product/:productId:
 *   delete:
 *     tags: [lists]
 *     description: Remove and delete a product from a list
 *     produces:
 *       - application/json
 */
router.delete('/:id/department/:departmentId/product/:productId', async (req, res) => {
    try {
        const product = await models.list_product.findOne({
            where: {
                listId: req.params.id,
                departmentId: req.params.departmentId,
                productId: req.params.productId
            }
        });

        if (product === null) {
            return res.json({message: 'Product not found'});
        }

        await product.destroy();

        res.json({message: 'Product remove from list with success'});
    }
    catch (e) {
        res.json({message: e.message});
    }
});

module.exports = router;