module.exports = (sequelize, DataTypes) => {
    return sequelize.define('invitation', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        }
    });
};