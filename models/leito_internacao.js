/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const LeitoInternacao = sequelize.define('LeitoInternacao', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_internacao: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'internacao',
        key: 'id'
      }
    },
    id_leito: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'leitos',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    id_admin: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'admin',
        key: 'id'
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'leito_internacao'
  });

  LeitoInternacao.associate = (listaDeModelos) => {
    
    LeitoInternacao.belongsTo(listaDeModelos.Leito, {
      foreignKey: 'id_leito',
      as: 'leito'
    }),
    LeitoInternacao.belongsTo(listaDeModelos.Internacao, {
      foreignKey: 'id_internacao',
      as: 'internacao'
    })
   
  
  }



  return LeitoInternacao;
};
