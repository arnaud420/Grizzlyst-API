module.exports = (sequelize, DataTypes) => {
    const ListProducts = sequelize.define('list_product', {
        quantity: {
            type: DataTypes.INTEGER,
        },
        // 0: non commencé / en cours
        // 1: terminé / trouvé
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