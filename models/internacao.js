/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Internacao = sequelize.define('Internacao', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    data_entrada: {
      type: DataTypes.DATE,
      allowNull: true
    },
    data_saida: {
      type: DataTypes.DATE,
      allowNull: true
    },
    id_paciente: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'paciente',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    origem: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    id_admin: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'admin',
        key: 'id'
      }
    }
  }, {
    tableName: 'internacao'
  });
  Internacao.associate = (listaDeModelos) => {
    Internacao.belongsToMany(listaDeModelos.Leito, {
      as: 'leito',
      through: 'LeitoInternacao',
      foreignKey: 'id_internacao',
      unique: false,
    }),
    Internacao.belongsTo(listaDeModelos.Paciente, {
      as: 'paciente',
      foreignKey: 'id_paciente'
    }) 
    Internacao.hasMany(listaDeModelos.Laudo, {
      foreignKey: 'id_internacao',
      as:'laudo'
    }),
    Internacao.hasMany(listaDeModelos.LeitoInternacao, {
      foreignKey: 'id_internacao',
      as:'leito_internacao'
    })
 
  }


  return Internacao
};
