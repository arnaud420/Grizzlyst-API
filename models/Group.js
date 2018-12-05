module.exports = (sequelize, DataTypes) => {
    return sequelize.define('group', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        adminId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    });
};