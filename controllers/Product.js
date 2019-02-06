const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/search/:product', async (req, res) => {
    try {
        console.log(req.params.product)
        const products = await models.product.findAll({
            where: { name: { $like: `%${req.params.product}%` } }
        });
        res.json(products)
    }
    catch (e) {
        res.json({message: e.error});
    }
});

module.exports = router;