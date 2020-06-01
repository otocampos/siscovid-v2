/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const TiposDeResultadoExame = sequelize.define('TiposDeResultadoExame', {
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
      tableName: 'resultado_exame',
    timestamps:false
  });
  return TiposDeResultadoExame
};
