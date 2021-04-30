const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sequelize = require("sequelize");
const moment = require('moment-timezone');
const Op = sequelize.Op;

const { User, Book, Who, Post, Community } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => { // 모든 라우터에 회원정보 넣어주기
    res.locals.user = req.user;
    next();
});

const upload = multer({  // multer 설정
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext); // 파일 덮어씌어지는거 방지
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

// 0415 무료나눔
router.post('/book', isLoggedIn, upload.single('img'), async (req, res, next) => {
    try {
        const { postmessage, title, price, author, publisher, checkCategory, checkState, dealRoot, about } = req.body;
        const book = await Book.create({
            OwnerId: req.user.id,
            postmessage: postmessage,
            title: title,
            author: author,
            publisher: publisher,
            img: req.file.filename,
            category: checkCategory,
            state: checkState,
            price: -1,
            tradingmethod: dealRoot,
            about: about,
            usernick: req.user.nick,
        });
        res.send(`<script type="text/javascript">alert("무료나눔 등록 완료"); location.href="/book/${book.id}";</script>`); // 등록 하고 자기가 등록한 책 화면 띄우게 하기
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0415 무료나눔내역 삭제
router.get('/delete', isLoggedIn, async (req, res, next) => {
    try {
        const { this_item_id, this_item_createdAt, this_item_OwnerId } = req.query;
        await Book.destroy({ where: { id: this_item_id, createdAt: this_item_createdAt, OwnerId: this_item_OwnerId }, });
        res.send(`<script type="text/javascript">alert("게시물 삭제 완료!"); location.href="/pages/myPostingList";</script>`);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0415 무료나눔 창에 수정을 누르면 나오는 수정하는 창을 띄어주는 라우터
router.post('/editIt', isLoggedIn, async (req, res, next) => {
    try {
        const { this_item_id } = req.body;
        const books = await Book.findOne({ where: { id: this_item_id, price: -1 } });
        console.log("books = ", books);
        res.render('edit_freeDetail.html', {
            books,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0415 무료나눔요청 게시물 수정하기
router.post('/edit', isLoggedIn, async (req, res, next) => {
    try {
        const { this_item_id, postmessage, title, author, publisher, checkCategory, dealRoot, about } = req.body;
        console.log("body = ", req.body);
        await Book.update({
            postmessage: postmessage,
            title: title,
            author: author,
            publisher: publisher,
            category: checkCategory,
            tradingmethod: dealRoot,
            about: about,
        }, {
            where: { id: this_item_id, price: -1 }
        });

        res.send(`<script type="text/javascript">alert("무료나눔 정보 수정 완료"); location.href="/book/${this_item_id}";</script>`); // 등록 하고 자기가 등록한 책 화면 띄우게 하기
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0417 커뮤니티내역 삭제
router.get('/delete_community', isLoggedIn, async (req, res, next) => {
    try {
        const { this_item_id, this_item_content, this_item_postingId } = req.query;
        if (this_item_postingId === String(req.user.id)) {
            const aa = await Community.destroy({ where: { id: this_item_id, postingId: req.user.id, content: this_item_content }, });
            res.send(`<script type="text/javascript">alert("게시물 삭제 완료!"); location.href="/pages/community";</script>`);
        } else {
            res.send(`<script type="text/javascript">alert("삭제 권한이 없습니다."); location.href="/free_community/community/${this_item_id}";</script>`);
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0417 커뮤니티 창에 수정을 누르면 나오는 수정하는 창을 띄어주는 라우터
router.post('/editIt_community', isLoggedIn, async (req, res, next) => {
    try {
        const { this_item_id, this_item_content, this_item_postingId } = req.body;
        if (this_item_postingId === String(req.user.id)) {
            const community = await Community.findOne({ where: { id: this_item_id, postingId: req.user.id, content: this_item_content }, });
            res.render('edit_commuDetail.html', {
                community,
            });
        } else {
            res.send(`<script type="text/javascript">alert("수정 권한이 없습니다."); location.href="/free_community/community/${this_item_id}";</script>`);
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0417 커뮤니티요청 게시물 수정하기
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


// 0415 커뮤니티 등록
router.post('/community', isLoggedIn, async (req, res, next) => {
    try {
        const { postTitle, postAbout } = req.body;
        const commu = await Community.create({
            title: postTitle,
            content: postAbout,
            postingId: req.user.id,
            postingNick: req.user.nick,
        });
        res.send(`<script type="text/javascript">alert("커뮤니티 등록 완료"); location.href="/free_community/community/${commu.id}";</script>`); // 등록 하고 자기가 등록한 책 화면 띄우게 하기
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0415 커뮤니티 들어가기
router.get('/community/:id', async (req, res, next) => {
    try {
        const [community] = await Promise.all([
            Community.findOne({
                where: { id: req.params.id },
            }),
        ]);
        const [comments] = await Promise.all([
            Post.findAll({
                where: {
                    CommunityId: req.params.id,
                    reCommentedId: null,
                },
                order: [['createdAt', 'DESC']],
            }),
        ]);

        const findcommentId = [];
        for (const find_commentId of comments) {
            const { id } = find_commentId;
            findcommentId.push(id);
        }
        // 대댓글들
        const [re_comments] = await Promise.all([
            Post.findAll({
                where: {
                    CommunityId: req.params.id,
                    reCommentingId: {
                        [Op.in]: findcommentId,
                    },
                },
                order: [['createdAt', 'ASC']],
            }),
        ]);
        // console.log("대댓글 = ", re_comments);
        // console.log("대댓글 테스트 = ", String(findcommentId));

        const re_time = [];
        for (const new_time of re_comments) {
            const { createdAt, id, content, UserId, reCommentNick, reCommentedId, reCommentingId } = new_time;
            re_time.push({
                createdAt: moment(createdAt).format('YYYY-MM-DD HH:mm:ss'),
                reCommentNick,
                reCommentedId,
                reCommentingId,
                content,
                id,
                UserId,
            });
        }
        const time = [];
        for (const new_time of comments) {
            const { createdAt, commentingNick, id, content, UserId } = new_time;
            time.push({
                createdAt: moment(createdAt).format('YYYY-MM-DD HH:mm:ss'),
                commentingNick,
                content,
                id,
                UserId
            });
        }
        if (res.locals.user) {
            console.log("login");
            /////////////

            console.log("@@! = ", req.user.id);
            const [books_for_notice] = await Promise.all([
                Book.findAll({
                    where: {
                        OwnerId: req.user.id,
                    }
                })
            ]);

            const [books_for_notice_commu] = await Promise.all([
                Community.findAll({
                    where: {
                        postingId: req.user.id,
                    }
                })
            ]);


            const notices = [];
            for (const notice of books_for_notice) {
                const { id } = notice;
                notices.push(id);
            }

            const [likesfornotice] = await Promise.all([
                Who.findAll({
                    where: {
                        thisbook: notices,
                        isNotified_like: {
                            [Op.ne]: '1'
                        },
                    }
                })
            ]);

            const notices_commu = [];
            for (const notice of books_for_notice_commu) {
                const { id } = notice;
                notices_commu.push(id);
            }

            console.log("WWW = ", notices);
            console.log("book = ", books_for_notice);
            console.log("user = ", req.user.id);
            const [noticess] = await Promise.all([
                Post.findAll({
                    where: {
                        [Op.or]: [
                            {
                                BookId: notices,
                                UserId: { [Op.ne]: String(req.user.id) }
                            }, { // 커뮤니티 댓글 구별
                                CommunityId: notices_commu,
                                UserId: { [Op.ne]: String(req.user.id) }
                            }],
                        isNotified_posts: {
                            [Op.ne]: '1'
                        },
                    }
                })
            ]);
            console.log("noticess = ", noticess);

            ////////////
            res.render('communityDetail.html', {
                community,
                createdAt: moment(community.createdAt).format('YYYY-MM-DD HH:mm:ss'),
                users: res.locals.user,
                user: community.postingId,
                communityId: community.id,
                comments: time,
                re_comments: re_time,
                noticess,
                likesfornotice,
            });
        } else if (isNotLoggedIn) {
            console.log("not login");
            res.render('communityDetail.html', {
                title: `책 구경`,
                community,
                createdAt: moment(community.createdAt).format('YYYY-MM-DD HH:mm:ss'),
                user: community.postingId,
                comments: time,
                re_comments: re_time,
            });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 커뮤니티 댓글 달기
router.post('/community/:id/comment', isLoggedIn, async (req, res, next) => {
    try {
        const { comment, communityId } = req.body;
        console.log("comment = ", comment);
        const post = await Post.create({
            content: comment,
            commentingNick: req.user.nick,
            UserId: req.user.id,
            CommunityId: req.params.id,
            thisURL: String(`/free_community/community/${communityId}`),
        });
        return res.send(`<script type="text/javascript">location.href="/free_community/community/${post.CommunityId}";</script>`);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0421 대댓글 기능 
router.post('/recomment', isLoggedIn, async (req, res, next) => {
    try {
        // console.log("@!@!@@");
        const { comment, UserId, communityId, commentId } = req.body;
        console.log("@!@!@@ = ", commentId);
        // console.log("@!@!@@ = ", communityId);
        // console.log("@!@!@@ = ", req.body);
        await Post.create({
            content: comment,
            UserId: req.user.id,
            CommunityId: communityId,
            reCommentingId: commentId,
            reCommentedId: req.user.id,
            reCommentNick: req.user.nick,
            thisURL: String(`/free_community/community/${communityId}`),
        });
        return res.send(`<script type="text/javascript">location.href="/free_community/community/${communityId}";</script>`);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;