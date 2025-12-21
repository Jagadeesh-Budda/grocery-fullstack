const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('Grocery',{
 id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
 name:{type:DataTypes.STRING,allowNull:false},
 category:DataTypes.STRING,
 price:{type:DataTypes.FLOAT,defaultValue:0},
 quantity:{type:DataTypes.INTEGER,defaultValue:0}
},{timestamps:false});
