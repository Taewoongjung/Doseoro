const Sequelize = require('sequelize');

module.exports = class Community extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
        title:{
            type: Sequelize.STRING(140),
            allowNull: true,
        },
        content: {
            type: Sequelize.STRING(1000),
            allowNull: true,
        },
        postingId: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        postingNick: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        commentingNick: {
            type: Sequelize.STRING(100),
            allowNull: true,
        },
        category: {
          type: Sequelize.STRING(70),
          allowNull: true,
        },
        hits: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        }
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
