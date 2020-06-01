/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Paciente = sequelize.define('Paciente', {
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
    rg: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true
    },
    dt_nascimento: {
      type: DataTypes.DATE,
      allowNull: false
    },
    cpf: {
      type: DataTypes.STRING(11),
      allowNull: false,
      unique: true
    },
    endereco: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    telefone: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    internado: {
      type: DataTypes.INTEGER(4),
      allowNull: false
    },
    tipo_usuario_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'tipousuarios',
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
    },
    situacao_cadastral_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'situacao_cadastral',
        key: 'id'
      }
    },
    obito: {
      type: DataTypes.INTEGER(4),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    genero: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    fuspom: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    }
  }, {
    tableName: 'paciente'
  });

  Paciente.associate = (listaDeModelos) => {
    Paciente.belongsTo(listaDeModelos.Situacao, {
      foreignKey: 'situacao_cadastral_id',
      as:'situacao'
    })
    Paciente.hasMany(listaDeModelos.Laudo, {
      foreignKey: 'paciente_id',
      as:'laudo'
    }),
    Paciente.hasMany(listaDeModelos.Internacao, {
      foreignKey: 'id_paciente',
      as:'internacao'
    })
     Paciente.belongsToMany(listaDeModelos.Parente, {
        as: 'parente',
        through: 'ParentePaciente',
        foreignKey: 'paciente_id'
     })
      
    
  }
  return Paciente
};
