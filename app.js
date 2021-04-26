const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const favicon = require('serve-favicon');
const passport = require('passport');
const helmet = require('helmet');
const hpp = require('hpp'); 
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

dotenv.config();
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
});
const { sequelize } = require('./models');
const passportConfig = require('./passport');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const pagesRouter = require('./routes/pages');
const commentRouter = require('./routes/comment');
const mpfuncRouter = require('./routes/mpfunc');
const wannabuyRouter = require('./routes/wannabuy');
const free_communityRouter = require('./routes/free_community');

const app = express();
passportConfig();
app.set('port', process.env.PORT || 1000);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});
sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

if (process.env.NODE_ENV === 'production') {
  app.enable('trust proxy');
  app.use(morgan('combined'));
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(hpp());
} else {
  app.use(morgan('dev'));
}
app.use(express.static(path.join(__dirname, './public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(favicon(path.join(__dirname, '/public/img/logo_clear.png')));
app.use(cookieParser(process.env.COOKIE_SECRET));
const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  // name: 'sessionCookie',
  // 배포 시 주석 풀기
  store: new RedisStore({ client: redisClient }),
};
if (process.env.NODE_ENV === 'production') {  //배포 할 때
  sessionOption.proxy = true;
}
app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/pages', pagesRouter);
app.use('/comment', commentRouter);
app.use('/mpfunc', mpfuncRouter);
app.use('/wannabuy', wannabuyRouter);
app.use('/free_community', free_communityRouter);

app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// const server = app.listen(app.get('port'), () => {
//   console.log(app.get('port'), '번 포트에서 대기중');
// });

module.exports = app;