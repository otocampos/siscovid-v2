/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  
  const Parentesco= sequelize.define('Parentesco', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true
    }
  }, {
      tableName: 'grau_parentesco',
    timestamps:false
  });


return Parentesco
};
