module.exports = (sequelize, DataTypes) => {
    const List = sequelize.define('list', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        state: {
            // 0: En attente
            // 1: En cours
            // 2: Terminé
            type: DataTypes.TINYINT,
            allowNull: false,
        }
    });

    List.associate = (models) => {
        models.list.belongsTo(models.group);
        models.list.belongsToMany(models.product, { through: 'list_products' });
    };

    return List;
};