/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
   const Admin =sequelize.define('Admin', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true
    },
    rg: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true
    },
    cpf: {
      type: DataTypes.STRING(11),
      allowNull: false,
      unique: true
    },
    senha: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
      tipoId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
        references: {
        model: 'tipousuario',
        key: 'id',
      }  
    },  
    
  }, {
      tableName: 'admin',
   });
  
  Admin.associate = (listaDeModelos) => {
    Admin.belongsTo(listaDeModelos.Tipousuario, {
      foreignkey: 'tipoId',
      as:'tipo'
    })
  }
  
  
  
  return Admin
};
