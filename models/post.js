const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {
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
      img: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      reCommentingId: {  // 이 아이디에 코멘트 달았다. 
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      reCommentedId: {  // 코멘트를 단 아이디
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      reCommentNick: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      isNotified_posts: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      // thisURL: { 댓글을 달면 해당 url을 가져오기
      //   type: Sequelize.STRING(500),
      //   allowNull: true,
      // },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Post',
      tableName: 'posts',
      paranoid: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.Post.belongsTo(db.User, { as: 'Commenting' });
    db.Post.belongsTo(db.Book, { as: 'Commenter' });
    db.Post.belongsTo(db.Community, { as: 'Poster' });
  }
};
