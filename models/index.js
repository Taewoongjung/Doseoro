const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require('./user');
const Book = require('./book');
const Whobot = require('./whobot');

const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.User = User;
db.Book = Book;
db.Whobot = Whobot;

User.init(sequelize);
Book.init(sequelize);
Whobot.init(sequelize);

User.associate(db);
Book.associate(db);
Whobot.associate(db);

module.exports = db;
