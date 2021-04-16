const express = require('express');
const sequelize = require("sequelize");
const Op = sequelize.Op;

const { User, Book, Who, Post, Community } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => { // 모든 라우터에 회원정보 넣어주기
    res.locals.user = req.user;
    next();
});

// 0403 댓글 수정(판매)
router.get('/commentEdit', isLoggedIn, async (req, res, next) => {
    try {
        const { UserId, commentId, comment_createdAt, bookId, edited_comment } = req.query;
        console.log("Com = ", edited_comment);
        const thisBook = await Book.findOne({ where: { id: bookId } });
        if (UserId === String(res.locals.user.id)){
              
            await Post.update({ 
                content: edited_comment,
            }, {
                where: { id: commentId, UserId: req.user.id } 
            });
            
            return res.send(`<script type="text/javascript">alert("댓글이 수정 되었습니다!"); location.href="/book/${thisBook.id}";</script>`);   

        } else {
            return res.send(`<script type="text/javascript">alert("수정 권한이 없습니다!"); location.href="/book/${thisBook.id}";</script>`);  
        }} catch (err) {
        console.error(err);
        next(err);
      }
});

// 댓글 삭제 (판매)
router.get('/commentDelete', isLoggedIn, async (req, res, next) => {
    try {
        const { UserId, commentId, comment_createdAt, bookId } = req.query;
        const thisBook = await Book.findOne({ where: { id: bookId } });
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

// 0403 댓글 수정(구매)
router.get('/commentEdit_buy', isLoggedIn, async (req, res, next) => {
    try {
        const { UserId, commentId, comment_createdAt, bookId, edited_comment } = req.query;
        console.log("Com = ", edited_comment);
        const thisBook = await Book.findOne({ where: { id: bookId } });
        if (UserId === String(res.locals.user.id)){

            await Post.update({ 
                content: edited_comment,
            }, {
                where: { id: commentId, UserId: req.user.id } 
            });
            
            return res.send(`<script type="text/javascript">alert("댓글이 수정 되었습니다!"); location.href="/wannabuy/buybook/${thisBook.id}";</script>`);   

        } else {
            return res.send(`<script type="text/javascript">alert("수정 권한이 없습니다!"); location.href="/wannabuy/buybook/${thisBook.id}";</script>`);  
        }} catch (err) {
        console.error(err);
        next(err);
      }
});

// 댓글 삭제 (구매)
router.get('/commentDelete_buy', isLoggedIn, async (req, res, next) => {
    try {
        const { UserId, commentId, comment_createdAt, bookId } = req.query;
        const thisBook = await Book.findOne({ where: { id: bookId } });
        if (UserId === String(res.locals.user.id)){
            await Post.destroy({ where: { id: commentId, UserId: req.user.id } });

            return res.send(`<script type="text/javascript">alert("댓글이 삭제 되었습니다!"); location.href="/wannabuy/buybook/${thisBook.id}";</script>`);        
        } else {
            return res.send(`<script type="text/javascript">alert("삭제 권한이 없습니다!"); location.href="/wannabuy/buybook/${thisBook.id}";</script>`);  
        }} catch (err) {
        console.error(err);
        next(err);
      }
});

// 0415 댓글 수정(커뮤니티)
router.get('/commentEdit_commu', isLoggedIn, async (req, res, next) => {
    try {
        const { UserId, commentId, comment_createdAt, communityId, edited_comment } = req.query;
        console.log("Com = ", edited_comment);
        console.log("Community id = ", communityId);
        const thisCommunity = await Community.findOne({ where: { id: String(communityId) } });
        if (UserId === String(res.locals.user.id)){

            await Post.update({ 
                content: edited_comment,
            }, {
                where: { id: commentId, UserId: req.user.id } 
            });
            
            return res.send(`<script type="text/javascript">alert("댓글이 수정 되었습니다!"); location.href="/free_community/community/${thisCommunity.id}";</script>`);   

        } else {
            return res.send(`<script type="text/javascript">alert("수정 권한이 없습니다!"); location.href="/free_community/community/${thisCommunity.id}";</script>`);  
        }} catch (err) {
        console.error(err);
        next(err);
      }
});

// 0415 댓글 삭제 (커뮤니티)
router.get('/commentDelete_commu', isLoggedIn, async (req, res, next) => {
    try {
        const { UserId, commentId, comment_createdAt, communityId } = req.query;
        const thisCommunity = await Community.findOne({ where: { id: communityId } });
        if (UserId === String(res.locals.user.id)){
            await Post.destroy({ where: { id: commentId, UserId: req.user.id } });

            return res.send(`<script type="text/javascript">alert("댓글이 삭제 되었습니다!"); location.href="/free_community/community/${thisCommunity.id}";</script>`);        
        } else {
            return res.send(`<script type="text/javascript">alert("삭제 권한이 없습니다!"); location.href="/free_community/community/${thisCommunity.id}";</script>`);  
        }} catch (err) {
        console.error(err);
        next(err);
      }
});

module.exports = router;