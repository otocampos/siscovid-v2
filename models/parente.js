/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Parente = sequelize.define('Parente', {
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
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    tel1: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    tel2: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    endereco: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    senha: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    grau_parentesco_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'grau_parentesco',
        key: 'id'
      }
    },
    tipo_usuario_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'tipo_usuario',
        key: 'id'
      }
    },
    admin_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'admin',
        key: 'id'
      }
    }
  }, {
    tableName: 'parente'
  });
  Parente.associate = (listaDeModelos) => {
     Parente.belongsToMany(listaDeModelos.Paciente, {
      as: 'paciente',
      through: 'ParentePaciente',
      foreignKey: 'parente_id'
    }) 

    Parente.belongsTo(listaDeModelos.Parentesco, {
      foreignKey: 'grau_parentesco_id',
      as: 'grParentesco'
    })
  }
  return Parente
};
