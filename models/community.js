const Sequelize = require('sequelize');

module.exports = class Community extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
        content: {
            type: Sequelize.STRING(140),
            allowNull: true,
        },
        commentingNick: {
            type: Sequelize.STRING(100),
            allowNull: true,
        },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Community',
      tableName: 'communities',
      paranoid: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.Community.hasMany(db.Post);
  }
};
