const express = require('express');
const router = express.Router();
const models = require('../models');

/**
 * @swagger
 *
 * /api/departments:
 *   get:
 *     tags: [departments]
 *     description: Get all departments
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: departments
 */
router.get('/', async (req, res) => {
    try {
        res.json(await models.department.findAll());
    }
    catch (e) {
        res.json({message: e.error});
    }
});

/**
 * @swagger
 *
 * /api/departments/:id:
 *   get:
 *     tags: [departments]
 *     description: Get department by id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: department
 */
router.get('/:id', async (req, res) => {
    try {
        res.json(await models.department.findByPk(req.params.id));
    }
    catch (e) {
        res.json({message: e.error});
    }
});

/**
 * @swagger
 *
 * /api/departments:
 *   post:
 *     tags: [departments]
 *     description: Create a new department
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: name
 *         description: Name for the department
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: department
 */
router.post('/', async (req, res) => {
    try {
        if (!req.body.name) {
            return res.json({message: 'Fields name required'})
        }
        const department = await models.department.create(req.body);
        res.json(department);
    }
    catch (e) {
        res.json({message: e.error});
    }
});

/**
 * @swagger
 *
 * /api/departments/:id:
 *   put:
 *     tags: [departments]
 *     description: Update an existing department
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: name
 *         description: Name for the department
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: department
 */
router.put('/:id', async (req, res) => {
    try {
        await models.department.update(req.body, {
            where: { id: req.params.id }
        });

        res.json({message: 'Department updated with success'});
    }
    catch (e) {
        res.json({message: e.message});
    }
});

/**
 * @swagger
 *
 * /api/departments/:id:
 *   delete:
 *     tags: [departments]
 *     description: Delete a department
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: department
 */
router.delete('/:id', async (req, res) => {
    try {
        const department = await models.department.findOne({
            where: { id: req.params.id }
        });

        if (department === null) {
            return res.json({message: 'Department not found'});
        }

        await department.destroy();
        return res.json({message: 'Department destroy with success'});
    }
    catch (e) {
        res.json({message: e.message});
    }
});



module.exports = router;