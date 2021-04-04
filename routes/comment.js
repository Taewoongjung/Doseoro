const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sequelize = require("sequelize");
const Op = sequelize.Op;

const { User, Book, Who, Post } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => { // 모든 라우터에 회원정보 넣어주기
    res.locals.user = req.user;
    next();
});

// 0403 댓글 수정
router.get('/commentEdit', isLoggedIn, async (req, res, next) => {
    try {
        console.log("@@@");
        const { commentId } = req.query;
        await Post.destroy({ where: { id: commentId, UserId: req.user.id } });
        return res.send(`<script type="text/javascript">alert("댓글이 수정 되었습니다!"); location.href="/pages/";</script>`);
    } catch (err) {
        console.error(err);
        next(err);
      }
});

// 0403 댓글 삭제
router.get('/commentDelete', isLoggedIn, async (req, res, next) => {
    try {
        const { commentId, comment_createdAt } = req.query;
        console.log();
        console.log("@@@@@@@");
        console.log(req.query);
        console.log("@@@@@@@");
        console.log();
        const thisBook = await Post.findOne({ where: { id: commentId, UserId: req.user.id } });
        console.log("@@111",req.user.id);
        await Post.destroy({ where: { id: commentId, UserId: req.user.id, createdAt: comment_createdAt } });
        console.log("@@",thisBook.BookId);
        return res.send(`<script type="text/javascript">alert("댓글이 삭제 되었습니다!"); location.href="/book/${thisBook.BookId}";</script>`);        
    } catch (err) {
        console.error(err);
        next(err);
      }
});

module.exports = router;