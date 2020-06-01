/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Laudo = sequelize.define('Laudo', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    dt_coleta: {
      type: DataTypes.DATE,
      allowNull: true
    },
    acordado: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: '0'
    },
    oxigenio: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: '0'
    },
    saturacao: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: '0'
    },
    respirador: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: '0'
    },
    sedado: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: '0'
    },
    dialise: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: '0'
    },
    aminas: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: '0'
    },
    obs: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    admin_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'admin',
        key: 'id'
      }
    },
    paciente_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'paciente',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    estadogeral_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'estado_geral',
        key: 'id'
      }
    },
    envio: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
    },
    data_envio: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    parente_envio_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'parente',
        key: 'id'
      }
    },
    tipolaudo_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'tipo_laudo',
        key: 'id'
      }
    },
    id_resultado_exame: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'resultado_exame',
        key: 'id'
      }
    },
    id_respiracao: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'respiracao',
        key: 'id'
      }
    },
    id_internacao: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'internacao',
        key: 'id'
      }
    }
  }, {
    tableName: 'laudo'
  });
  Laudo.associate = (listaDeModelos) => {
    Laudo.belongsTo(listaDeModelos.EstadoGeral, {
      foreignKey: 'estadogeral_id',
      as: 'estadoGeral'
    }),
    Laudo.belongsTo(listaDeModelos.TipoLaudo, {
      foreignKey: 'tipolaudo_id',
      as: 'tipoLaudo'
    }),
      Laudo.belongsTo(listaDeModelos.TiposDeResultadoExame, {
        foreignKey: 'id_resultado_exame',
        as: 'resultado'
      }),
      Laudo.belongsTo(listaDeModelos.Paciente, {
        foreignKey: 'paciente_id',
        as: 'paciente'
      }),
      Laudo.belongsTo(listaDeModelos.Respiracao, {
        foreignKey: 'id_respiracao',
        as: 'respiracao'
      })
    
  }
  return Laudo
};
