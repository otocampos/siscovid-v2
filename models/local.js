
module.exports = function(sequelize, DataTypes) {
  const Local = sequelize.define('Local', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    desc: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    tipo: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
  }, {
      tableName: 'local',
    timestamps:false
  });
  Local.associate = (listaDeModelos) => {
    Local.hasMany(listaDeModelos.Leito, {
      foreignKey: 'idlocal',
      as: 'leito'
    })
  }
return Local

};
