module.exports = (sequelize, DataTypes) => {
    return sequelize.define('department', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });
};