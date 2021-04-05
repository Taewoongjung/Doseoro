const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require('./user');
const Book = require('./book');
const Who = require('./who');
const Post = require('./post');
const Hashtag = require('./hashtag');

const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.User = User;
db.Book = Book;
db.Who = Who;
db.Post = Post;
db.Hashtag = Hashtag;

User.init(sequelize);
Book.init(sequelize);
Who.init(sequelize);
Post.init(sequelize);
Hashtag.init(sequelize);

User.associate(db);
Book.associate(db);
Who.associate(db);
Post.associate(db);
Hashtag.associate(db);

module.exports = db;
