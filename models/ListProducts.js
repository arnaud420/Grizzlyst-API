module.exports = (sequelize, DataTypes) => {
    const ListProducts = sequelize.define('list_product', {
        state: {
            // 0: non ajouté
            // 1: ajouté
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    });

    ListProducts.associate = (models) => {
        models.list_product.belongsTo(models.product);
        models.list_product.belongsTo(models.list);
        models.list_product.belongsTo(models.department);
    };

    return ListProducts;
};