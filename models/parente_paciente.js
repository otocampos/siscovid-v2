/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const ParentePaciente= sequelize.define('ParentePaciente', {
    parente_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'parente',
        key: 'id'
      }
    },
    paciente_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'paciente',
        key: 'id'
      }
    }
  }, {
      tableName: 'parente_paciente',
    timestamps:false
  });
 
  return ParentePaciente
};
