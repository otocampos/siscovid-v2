
module.exports = function(sequelize, DataTypes) {
    const EstadoGeral= sequelize.define('EstadoGeral', {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      nome: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true
      }
    }, {
        tableName: 'estado_geral',
      timestamps:false
    });
    return EstadoGeral
  };