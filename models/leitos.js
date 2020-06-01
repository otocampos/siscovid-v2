/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Leito = sequelize.define('Leito', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    numero: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    desc: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ocupado: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    idlocal: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'local',
        key: 'id'
      }
    }
  }, {
      tableName: 'leitos',
    timestamps:false
  });
  Leito.associate = (listaDeModelos) => {
    Leito.belongsToMany(listaDeModelos.Internacao, {
      as: 'internacao',
      through: 'LeitoInternacao',
      foreignKey: 'id_leito',
      unique: false
    }),
    Leito.belongsTo(listaDeModelos.Local, {
      foreignKey: 'idlocal',
      as: 'local'
    }),
    Leito.hasMany(listaDeModelos.LeitoInternacao, {
      foreignKey: 'id_leito',
      as:'leito_internacao'
    })  
  
  }
  return Leito
};
