const express = require('express');
const moment = require('moment-timezone');
const sequelize = require("sequelize");
const Op = sequelize.Op;

const { User, Book, Who, Post, Community, Complain } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => { // 모든 라우터에 회원정보 넣어주기
    res.locals.user = req.user;
    next();
});

router.post('/customerComplain', isLoggedIn, async (req, res, next) => {
    try {
        const { postTitle, postAbout } = req.body;
        const Acomplain = await Complain.create({
            title: postTitle,
            content: postAbout,
            complainedId: req.user.id,
            complainedNick: req.user.nick,
        });
        res.send(`<script type="text/javascript">alert("고객문의에 등록 하였습니다."); location.href="/customer/complain/${Acomplain.id}";</script>`);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0415 커뮤니티 들어가기
router.get('/complain/:id', async (req, res, next) => {
    try {
        const [complain] = await Promise.all([
            Complain.findOne({
                where: { id: req.params.id },
            }),
        ]);

        const plus_hits = complain.hits + 1; // 조회수 +1
        console.log("@@ = ", plus_hits);

        await Complain.update({
            hits: plus_hits,
        }, {
            where: { id: req.params.id }
        });

        const [comments] = await Promise.all([
            Post.findAll({
                where: {
                    ComplainId: req.params.id, // complainId로 바꿔야함
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
                    ComplainId: req.params.id, // complainId로 바꿔야함
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

        res.render('csDetail.html', {
            title: `고객문의`,
            complain,
            createdAt: moment(complain.createdAt).format('YYYY-MM-DD HH:mm:ss'),
            user: res.locals.user,
            complainId: complain.id,
            comments: time,
            re_comments: re_time,
            noticess,
            likesfornotice,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 고객문의 댓글 달기
router.post('/complain/:id/comment', isLoggedIn, async (req, res, next) => {
    try {
        const { comment, complainId } = req.body;
        console.log("comment = ", comment);
        console.log("complainId = ", complainId);
        const post = await Post.create({
            content: comment,
            commentingNick: req.user.nick,
            UserId: req.user.id,
            ComplainId: req.params.id,
            thisURL: String(`/customer/complain/${complainId}`),
        });
        console.log("req.params.id=", req.params.id);
        return res.send(`<script type="text/javascript">location.href="/customer/complain/${complainId}";</script>`);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 고객문의 대댓글 기능 
router.post('/recomment', isLoggedIn, async (req, res, next) => {
    try {
        // console.log("/complain/recomment 진입");
        const { comment, UserId, complainId, commentId } = req.body;
        console.log("complain에 commentId = ", commentId);
        // console.log("complainId = ", complainId);
        // console.log("req.body = ", req.body);
        await Post.create({
            content: comment,
            UserId: req.user.id,
            ComplainId: complainId,
            reCommentingId: commentId,
            reCommentedId: req.user.id,
            reCommentNick: req.user.nick,
            thisURL: String(`/customer/complain/${complainId}";`),
        });
        return res.send(`<script type="text/javascript">location.href="/customer/complain/${complainId}";</script>`);
    } catch (error) {
        console.error(error);
        next(error);
    }
});



module.exports = router;