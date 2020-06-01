/* jshint indent: 2 */

module.exports = (sequelize, DataTypes)=> {
  const Tipousuario =sequelize.define('Tipousuario', {
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
      timestamps: false
  });


  
  return Tipousuario;
};
