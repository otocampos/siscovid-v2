/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
   const TipoLaudo =sequelize.define('TipoLaudo', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
       tableName: 'tipo_laudo',
       timestamps:false
    
   });
  
  return TipoLaudo;
};
