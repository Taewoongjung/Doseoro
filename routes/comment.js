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
        const { user, UserId, commentId, comment_createdAt, bookId } = req.query;  // user = Book.OwnerId
        console.log("UserId ", typeof(UserId));
        console.log("res.locals.user ", typeof(res.locals.user.id));
        const thisBook = await Book.findOne({ where: { id: bookId } });
        console.log("thisbook = ", thisBook);
        if (UserId === String(res.locals.user.id)){
            await Post.destroy({ where: { id: commentId, UserId: req.user.id, createdAt: comment_createdAt } });

            return res.send(`<script type="text/javascript">alert("댓글이 삭제 되었습니다!"); location.href="/book/${thisBook.id}";</script>`);        
        } else {
            return res.send(`<script type="text/javascript">alert("삭제 권한이 없습니다!"); location.href="/book/${thisBook.id}";</script>`);  
        }} catch (err) {
        console.error(err);
        next(err);
      }
});

module.exports = router;