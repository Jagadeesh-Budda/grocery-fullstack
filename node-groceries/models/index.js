const { Sequelize } = require('sequelize');
const dbUrl = process.env.DATABASE_URL || 'postgres://pguser:pgpass@localhost:5432/groceriesdb';
const sequelize = new Sequelize(dbUrl, { dialect: 'postgres', logging: false });

const Grocery = require('./grocery')(sequelize);
const User = require('./user')(sequelize);

module.exports = { sequelize, Grocery, User };
