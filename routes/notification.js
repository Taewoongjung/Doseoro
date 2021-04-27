const express = require('express');
const multer = require('multer');
const path = require('path');

const { User, Book, Who, Post } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => { // 모든 라우터에 회원정보 넣어주기
    res.locals.user = req.user;
    next();
});

router.get('/witoutCommu', async(req, res, next) => {

});

router.get('/onlyCommu', async(req, res, next) => {

});

module.exports = router;