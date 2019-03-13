const _ = require('lodash');
const models = require('../models');

module.exports = {
    getProductsFromDepartment: async (listId) => {
        try {
            const query = await models.sequelize.query(`
            SELECT 
                d.id AS departmentId, 
                d.name AS departmentName, 
                p.id, 
                p.name, 
                p.quantity as weight, 
                p.brand, 
                p.nutrition_grade, 
                p.image_url, 
                lp.quantity
            FROM list_departments ld
            LEFT JOIN list_products lp
            ON ld.departmentId = lp.departmentId
            LEFT JOIN products p 
            ON p.id = lp.productId
            LEFT JOIN departments d 
            ON d.id = ld.departmentId
            WHERE ld.listId = ${listId}`, { type: models.sequelize.QueryTypes.SELECT });

            return _.groupBy(query, (data) => data.departmentName);
        }
        catch (e) {
            throw new Error(e.message);
        }

    }
};