/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Respiracao = sequelize.define('Respiracao', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
      tableName: 'respiracao',
    timestamps:false
  });
  return Respiracao;
};
