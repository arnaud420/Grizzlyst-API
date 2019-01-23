module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('product', {
        _id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.STRING,
        },
        image_url: {
            type: DataTypes.STRING
        },
        brand: {
            type: DataTypes.STRING
        },
        satured_fat: {
            type: DataTypes.FLOAT
        },
        fat: {
            type: DataTypes.FLOAT
        },
        proteins: {
            type: DataTypes.FLOAT
        },
        sugars: {
            type: DataTypes.FLOAT
        },
        energy: {
            type: DataTypes.FLOAT
        },
        salt: {
            type: DataTypes.FLOAT
        },
        fiber: {
            type: DataTypes.FLOAT
        },
        carbohydrates: {
            type: DataTypes.FLOAT
        },
        sodium: {
            type: DataTypes.FLOAT
        },
        nutrient_levels: {
            type: DataTypes.STRING
        },
        nutrition_grade: {
            type: DataTypes.STRING
        },
    });

    Product.associate = (models) => {
        models.product.hasMany(models.list_product);
        models.product.belongsToMany(models.group, { through: 'favorite_product' });
    };

    return Product;
};