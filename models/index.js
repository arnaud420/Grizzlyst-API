const Sequelize = require('sequelize');
const { DB_NAME, DB_PASSWORD, DB_USERNAME } = require('../config/db');

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false
});

const User = sequelize.import(__dirname + '/User');
const Group = sequelize.import(__dirname + '/Group');
const List = sequelize.import(__dirname + '/List');
const Product = sequelize.import(__dirname + '/Product');
const Department = sequelize.import(__dirname + '/Department');
const ListProduct = sequelize.import(__dirname + '/ListProduct');

// UserGroup
User.belongsToMany(Group, { through: 'user_group' });
Group.belongsToMany(User, { through: 'user_group' });

// Favorites (groupDepartment)
Department.belongsToMany(Group, { through: 'favorite' });
Group.belongsToMany(Department, { through: 'favorite' });

List.belongsTo(Group);
Department.belongsTo(Group);

ListProduct.belongsTo(Product);
ListProduct.belongsTo(List);
ListProduct.belongsTo(Department);

module.exports = {
    sequelize,
    User,
    Group,
    List,
    Product,
    Department,
    ListProduct
};