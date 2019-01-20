module.exports = (sequelize, DataTypes) => {
    const Invitation = sequelize.define('invitation', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        }
    });

    Invitation.associate = (models) => {
        models.invitation.belongsTo(models.group);
    };

    return Invitation;
};