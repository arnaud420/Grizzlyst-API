module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user_groups', {
        status: {
            type: DataTypes.BOOLEAN,
        },
    });
};