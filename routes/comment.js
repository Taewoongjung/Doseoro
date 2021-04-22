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

// 댓글 수정(판매)
router.get('/commentEdit', isLoggedIn, async (req, res, next) => {
    try {
        const { UserId, commentId, bookId, edited_comment } = req.query;
        console.log("Com = ", edited_comment);
        const thisBook = await Book.findOne({ where: { id: bookId } });
        if (UserId !== String(res.locals.user.id)){
            return res.send(`<script type="text/javascript">alert("수정 권한이 없습니다!"); location.href="/book/${thisBook.id}";</script>`);  
        } else {
            if ( edited_comment === String(null)){
                return res.send(`<script type="text/javascript">alert("댓글이 수정이 취소 되었습니다!"); location.href="/book/${thisBook.id}";</script>`);   
            }
            await Post.update({ 
                content: edited_comment,
            }, {
                where: { id: commentId, UserId: req.user.id } 
            });
            return res.send(`<script type="text/javascript">alert("댓글이 수정 되었습니다!"); location.href="/book/${thisBook.id}";</script>`);
        }
    } catch (err) {
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
            await Post.destroy({ where: { id: commentId, UserId: req.user.id } });

            return res.send(`<script type="text/javascript">alert("댓글이 삭제 되었습니다!"); location.href="/book/${thisBook.id}";</script>`);        
        } else {
            return res.send(`<script type="text/javascript">alert("삭제 권한이 없습니다!"); location.href="/book/${thisBook.id}";</script>`);  
        }} catch (err) {
        console.error(err);
        next(err);
      }
});

// 대댓글 수정(판매)
router.get('/reCommentEdit', isLoggedIn, async (req, res, next) => {
    try {
        const { recomment_UserId, bookId, commentId, reCom_edited_comment, recomment_reCommentedId } = req.query;
        console.log("Com = ", reCom_edited_comment);
        console.log("ID = ", commentId);
        console.log("recomment_reCommentedId = ", recomment_reCommentedId);
        console.log("UserId = ", String(recomment_UserId));
        console.log("req.user.id = ", req.user.id);
        console.log("req.locals.user.id = ", res.locals.user.id);
        const thisBook = await Book.findOne({ where: { id: bookId } });
        if (recomment_UserId !== String(req.user.id)){
            return res.send(`<script type="text/javascript">alert("수정 권한이 없습니다!"); location.href="/book/${thisBook.id}";</script>`);  
        } else {
            if ( reCom_edited_comment === String(null)){
                return res.send(`<script type="text/javascript">alert("댓글이 수정이 취소 되었습니다!"); location.href="/book/${thisBook.id}";</script>`);   
            }
            await Post.update({
                content: reCom_edited_comment,
            }, {
                where: { id: commentId } 
            });
            return res.send(`<script type="text/javascript">alert("댓글이 수정 되었습니다!"); location.href="/book/${thisBook.id}";</script>`);
        }
    } catch (err) {
        console.error(err);
        next(err);
      }
});

// 0403 댓글 수정(구매)
router.get('/commentEdit_buy', isLoggedIn, async (req, res, next) => {
    try {
        const { UserId, commentId, bookId, edited_comment } = req.query;
        console.log("Com = ", edited_comment);
        const thisBook = await Book.findOne({ where: { id: bookId } });
        if (UserId === String(res.locals.user.id)){
            if ( edited_comment === String(null)){
                return res.send(`<script type="text/javascript">alert("댓글이 수정이 취소 되었습니다!"); location.href="/wannabuy/buybook/${thisBook.id}";</script>`);   
            }
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
        const { UserId, commentId, communityId, edited_comment } = req.query;
        console.log("Com = ", edited_comment);
        console.log("Community id = ", communityId);
        const thisCommunity = await Community.findOne({ where: { id: String(communityId) } });
        if (UserId === String(res.locals.user.id)){
            if ( edited_comment === String(null)){
                return res.send(`<script type="text/javascript">alert("댓글이 수정이 취소 되었습니다!"); location.href="/free_community/community/${thisCommunity.id}";</script>`);   
            }
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