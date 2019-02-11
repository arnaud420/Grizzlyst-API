module.exports = (sequelize, DataTypes) => {
    const ListProducts = sequelize.define('list_product', {
        quantity: {
            type: DataTypes.INTEGER,
        },
        state: {
            type: DataTypes.BOOLEAN
        }
    });

    ListProducts.associate = (models) => {
        models.list_product.belongsTo(models.product);
        models.list_product.belongsTo(models.list);
        models.list_product.belongsTo(models.department);
    };

    return ListProducts;
};