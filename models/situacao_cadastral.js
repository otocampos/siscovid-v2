/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Situacao= sequelize.define('Situacao', {
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
      tableName: 'situacao_cadastral',
    timestamps:false
  });
  return Situacao
};
