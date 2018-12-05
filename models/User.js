module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        pseudo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            isEmail: true,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            len: [6, 16],
        },
    });
};