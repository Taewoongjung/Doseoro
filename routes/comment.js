const express = require('express');
const sequelize = require("sequelize");
const Op = sequelize.Op;

const { User, Book, Who, Post, Community, Complain } = require('../models');
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
        const { UserId, commentId, bookId } = req.query;
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
        const { recomment_UserId, re_bookId, re_commentId, reCom_edited_comment, recomment_reCommentedId } = req.query;
        
        const thisBook = await Book.findOne({ where: { id: re_bookId } });
        if (recomment_reCommentedId !== String(req.user.id)){
            return res.send(`<script type="text/javascript">alert("수정 권한이 없습니다!"); location.href="/book/${thisBook.id}";</script>`);  
        } else {
            if ( reCom_edited_comment === String(null)){
                return res.send(`<script type="text/javascript">alert("댓글이 수정이 취소 되었습니다!"); location.href="/book/${thisBook.id}";</script>`);   
            }
            await Post.update({
                content: reCom_edited_comment,
            }, {
                where: { id: re_commentId } 
            });
            return res.send(`<script type="text/javascript">alert("댓글이 수정 되었습니다!"); location.href="/book/${thisBook.id}";</script>`);
        }
    } catch (err) {
        console.error(err);
        next(err);
      }
});

// 대댓글 삭제 (판매)
router.get('/reCommentDelete', isLoggedIn, async (req, res, next) => {
    try {
        const { recomment_UserId, re_commentId, re_bookId, recomment_reCommentedId } = req.query;

        const thisBook = await Book.findOne({ where: { id: re_bookId } });
        if (recomment_reCommentedId === String(res.locals.user.id)){
            const a = await Post.destroy({ where: { id: re_commentId, UserId: req.user.id } });
            console.log("@!@! = ", a);
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
        const { UserId, commentId, bookId } = req.query;
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

// 대댓글 삭제(구매)
router.get('/reCommentDelete_buy', isLoggedIn, async (req, res, next) => {
    try {
        const { recomment_UserId, re_commentId, re_bookId, recomment_reCommentedId } = req.query;

        const thisBook = await Book.findOne({ where: { id: re_bookId } });
        if (recomment_reCommentedId === String(res.locals.user.id)){
            await Post.destroy({ where: { id: re_commentId, UserId: req.user.id } });

            return res.send(`<script type="text/javascript">alert("댓글이 삭제 되었습니다!"); location.href="/wannabuy/buybook/${re_bookId}";</script>`);        
        } else {
            return res.send(`<script type="text/javascript">alert("삭제 권한이 없습니다!"); location.href="/wannabuy/buybook/${re_bookId}";</script>`);  
        }} catch (err) {
        console.error(err);
        next(err);
      }
});

// 대댓글 수정(구매)
router.get('/reCommentEdit_buy', isLoggedIn, async (req, res, next) => {
    try {
        // console.log(req.query);
        // console.log(' ');
        const { recomment_UserId, re_bookId, re_commentId, reCom_edited_comment, recomment_reCommentedId } = req.query;
        // console.log("Com = ", reCom_edited_comment);
        // console.log("ID = ", re_commentId);
        // console.log("recomment_reCommentedId = ", recomment_reCommentedId);
        // console.log("UserId = ", String(recomment_UserId));
        // console.log("req.user.id = ", req.user.id);
        // console.log("req.locals.user.id = ", res.locals.user.id);
        if (recomment_reCommentedId !== String(req.user.id)){
            return res.send(`<script type="text/javascript">alert("수정 권한이 없습니다!"); location.href="/wannabuy/buybook/${re_bookId}";</script>`);  
        } else {
            if ( reCom_edited_comment === String(null)){
                return res.send(`<script type="text/javascript">alert("댓글이 수정이 취소 되었습니다!"); location.href="/wannabuy/buybook/${re_bookId}";</script>`);   
            }
            await Post.update({
                content: reCom_edited_comment,
            }, {
                where: { id: re_commentId } 
            });
            return res.send(`<script type="text/javascript">alert("댓글이 수정 되었습니다!"); location.href="/wannabuy/buybook/${re_bookId}";</script>`);
        }
    } catch (err) {
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

// 0423 대댓글 수정(커뮤니티)
router.get('/reCommentEdit_commu', isLoggedIn, async (req, res, next) => {
    try {
        console.log(req.query);
        console.log('@@@@@ 커뮤니티 대댓글 수정 @@@@@');
        const { recomment_UserId, re_bookId, communityId, re_commentId, reCom_edited_comment, recomment_reCommentedId } = req.query;
        console.log("Com = ", reCom_edited_comment);
        console.log("communityId = ", communityId);
        console.log("ID = ", re_commentId);
        console.log("recomment_reCommentedId = ", recomment_reCommentedId);
        console.log("UserId = ", String(recomment_UserId));
        console.log("req.user.id = ", req.user.id);
        console.log("req.locals.user.id = ", res.locals.user.id);
        if (recomment_reCommentedId !== String(req.user.id)){
            return res.send(`<script type="text/javascript">alert("수정 권한이 없습니다!"); location.href="/free_community/community/${communityId}";</script>`);  
        } else {
            if ( reCom_edited_comment === String(null)){
                return res.send(`<script type="text/javascript">alert("댓글이 수정이 취소 되었습니다!"); location.href="/free_community/community/${communityId}";</script>`);   
            }
            await Post.update({
                content: reCom_edited_comment,
            }, {
                where: { id: re_commentId } 
            });
            return res.send(`<script type="text/javascript">alert("댓글이 수정 되었습니다!"); location.href="/free_community/community/${communityId}";</script>`);
        }
    } catch (err) {
        console.error(err);
        next(err);
      }
});

// 0423 대댓글 삭제 (커뮤니티)
router.get('/reCommentDelete_commu', isLoggedIn, async (req, res, next) => {
    try {
        const { recomment_UserId, re_commentId, communityId, recomment_reCommentedId } = req.query;
        console.log("user id = ", res.locals.user.id);
        console.log("recommenid = ", String(recomment_reCommentedId));
        if (String(recomment_reCommentedId) === String(res.locals.user.id)){
            await Post.destroy({ where: { id: re_commentId, UserId: req.user.id } });

            return res.send(`<script type="text/javascript">alert("댓글이 삭제 되었습니다!"); location.href="/free_community/community/${communityId}";</script>`);        
        } else {
            return res.send(`<script type="text/javascript">alert("삭제 권한이 없습니다!"); location.href="/free_community/community/${communityId}";</script>`);  
        }} catch (err) {
        console.error(err);
        next(err);
    }
});

// 0507댓글 수정(고객문의)
router.get('/commentEdit_customer', isLoggedIn, async (req, res, next) => {
    try {
        const { UserId, commentId, complainId, edited_comment } = req.query;
        console.log("Com = ", edited_comment);
        console.log("thisComplain id = ", complainId);
        const thisComplain = await Complain.findOne({ where: { id: String(complainId) } });
        if (UserId === String(res.locals.user.id)){
            if ( edited_comment === String(null)){
                return res.send(`<script type="text/javascript">alert("댓글이 수정이 취소 되었습니다!"); location.href="/customer/complain/${thisComplain.id}";</script>`);   
            }
            await Post.update({ 
                content: edited_comment,
            }, {
                where: { id: commentId, UserId: req.user.id } 
            });
            
            return res.send(`<script type="text/javascript">alert("댓글이 수정 되었습니다!"); location.href="/customer/complain/${thisComplain.id}";</script>`);   

        } else {
            return res.send(`<script type="text/javascript">alert("수정 권한이 없습니다!"); location.href="/customer/complain/${thisComplain.id}";</script>`);  
        }} catch (err) {
        console.error(err);
        next(err);
      }
});

// 0507 댓글 삭제(고객문의)
router.get('/commentDelete_customer', isLoggedIn, async (req, res, next) => {
    try {
        const { UserId, commentId, comment_createdAt, complainId } = req.query;
        const thisComplain = await Complain.findOne({ where: { id: complainId } });
        if (UserId === String(res.locals.user.id)){
            await Post.destroy({ where: { id: commentId, UserId: req.user.id } });

            return res.send(`<script type="text/javascript">alert("댓글이 삭제 되었습니다!"); location.href="/customer/complain/${thisComplain.id}";</script>`);        
        } else {
            return res.send(`<script type="text/javascript">alert("삭제 권한이 없습니다!"); location.href="/customer/complain/${thisComplain.id}";</script>`);  
        }} catch (err) {
        console.error(err);
        next(err);
      }
});

// 0507 대댓글 수정(고객문의)
router.get('/reCommentEdit_customer', isLoggedIn, async (req, res, next) => {
    try {
        console.log('@@@@@ 고객문의 대댓글 수정 @@@@@');
        const { recomment_UserId, re_bookId, complainId, re_commentId, reCom_edited_comment, recomment_reCommentedId } = req.query;
        if (recomment_reCommentedId !== String(req.user.id)){
            return res.send(`<script type="text/javascript">alert("수정 권한이 없습니다!"); location.href="/customer/complain/${complainId}";</script>`);  
        } else {
            if ( reCom_edited_comment === String(null)){
                return res.send(`<script type="text/javascript">alert("댓글이 수정이 취소 되었습니다!"); location.href="/customer/complain/${complainId}";</script>`);   
            }
            await Post.update({
                content: reCom_edited_comment,
            }, {
                where: { id: re_commentId } 
            });
            return res.send(`<script type="text/javascript">alert("댓글이 수정 되었습니다!"); location.href="/customer/complain/${complainId}";</script>`);
        }
    } catch (err) {
        console.error(err);
        next(err);
      }
});

// 0507 대댓글 삭제 (고객문의)
router.get('/reCommentDelete_customer', isLoggedIn, async (req, res, next) => {
    try {
        const { recomment_UserId, re_commentId, complainId, recomment_reCommentedId } = req.query;
        if (String(recomment_reCommentedId) === String(res.locals.user.id)){
            await Post.destroy({ where: { id: re_commentId, UserId: req.user.id } });

            return res.send(`<script type="text/javascript">alert("댓글이 삭제 되었습니다!"); location.href="/customer/complain/${complainId}";</script>`);        
        } else {
            return res.send(`<script type="text/javascript">alert("삭제 권한이 없습니다!"); location.href="/customer/complain/${complainId}";</script>`);  
        }} catch (err) {
        console.error(err);
        next(err);
    }
});

// 0507 고객문의 게시물내용 수정하기
router.post('/edit_community', isLoggedIn, async (req, res, next) => {
    try {
        const { this_item_id, communityTitle, communityContent } = req.body;
        console.log("body = ", req.body);
        const a = await Community.update({
            title: communityTitle,
            content: communityContent,
        }, {
            where: { id: this_item_id }
        });
        console.log("body = ", req.body);
        console.log("aa = ", a);

        res.send(`<script type="text/javascript">alert("커뮤니티 정보 수정 완료"); location.href="/free_community/community/${this_item_id}";</script>`); // 등록 하고 자기가 등록한 책 화면 띄우게 하기
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;