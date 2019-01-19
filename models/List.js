module.exports = (sequelize, DataTypes) => {
    return sequelize.define('list', {
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
};