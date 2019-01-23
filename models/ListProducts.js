module.exports = (sequelize, DataTypes) => {
    const ListProducts = sequelize.define('list_product', {
        quantity: {
            type: DataTypes.INTEGER,
        }
    });

    ListProducts.associate = (models) => {
        models.list_product.belongsTo(models.product);
        models.list_product.belongsTo(models.list);
        models.list_product.belongsTo(models.department);
    };

    return ListProducts;
};