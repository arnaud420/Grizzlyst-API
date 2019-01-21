module.exports = (sequelize, DataTypes) => {
    const Department = sequelize.define('department', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        icon: {
            type: DataTypes.STRING,
        }
    });

    Department.associate = (models) => {
        models.department.belongsToMany(models.group, { through: 'favorite' })
    };

    return Department;
};