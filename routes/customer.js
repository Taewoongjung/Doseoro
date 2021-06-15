const express = require('express');
const moment = require('moment-timezone');
const sequelize = require("sequelize");
const Op = sequelize.Op;

const { Book, Who, Post, Community, Complain } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => { // 모든 라우터에 회원정보 넣어주기
    res.locals.user = req.user;
    next();
});

// 고객문의 등록하기
router.post('/customerComplain', isLoggedIn, async (req, res, next) => {
    try {
        console.log("customer/customerComplain 진입");

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
        console.log("customer/complain/:id 진입");

        const [complain] = await Promise.all([
            Complain.findOne({
                where: { id: req.params.id },
            }),
        ]);

        const plus_hits = complain.hits + 1; // 조회수 +1
        console.log("is added? = ", plus_hits);

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

        const re_time = [];
        for (const new_time of re_comments) {
            const { createdAt, id, content, UserId, reCommentNick, reCommentedId, reCommentingId } = new_time;
            re_time.push({
                createdAt: moment(createdAt).format('YYYY.MM.DD HH:mm'),
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
                createdAt: moment(createdAt).format('YYYY.MM.DD HH:mm'),
                commentingNick,
                content,
                id,
                UserId
            });
        }

        //////////// 알림 ////////////
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
        //////////// 알림 ////////////

        res.render('csDetail.html', {
            title: `고객문의`,
            complain,
            createdAt: moment(complain.createdAt).format('YYYY.MM.DD HH:mm'),
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
        console.log("customer/complain/:id/comment 진입");

        const { comment, complainId } = req.body;
        const post = await Post.create({
            content: comment,
            commentingNick: req.user.nick,
            UserId: req.user.id,
            ComplainId: req.params.id,
            thisURL: String(`/customer/complain/${complainId}`),
        });

        return res.send(`<script type="text/javascript">location.href="/customer/complain/${complainId}";</script>`);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 고객문의 대댓글 기능 
router.post('/recomment', isLoggedIn, async (req, res, next) => {
    try {
        console.log("/customer/recomment 진입");
        const { comment, complainId, commentId } = req.body;
        console.log("complain에 commentId = ", commentId);

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

// 0507 고객문의 게시글 삭제
router.get('/delete_customer', isLoggedIn, async (req, res, next) => {
    try {
        console.log("/customer/delete_customer 진입");

        const { this_item_id, this_item_content, this_item_complainedId } = req.query;
        if (this_item_complainedId === String(req.user.id)) {
            await Complain.destroy({ where: { id: this_item_id, complainedId: req.user.id, content: this_item_content }, });
            res.send(`<script type="text/javascript">alert("게시물 삭제 완료!"); location.href="/pages/csList";</script>`);
        } else {
            res.send(`<script type="text/javascript">alert("삭제 권한이 없습니다."); location.href="/customer/complain/${this_item_id}";</script>`);
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0507 고객문의 창에 수정을 누르면 나오는 수정하는 창을 띄어주는 라우터
router.post('/editIt_complain', isLoggedIn, async (req, res, next) => {
    try {
        console.log("/customer/editIt_complain 진입");

        const { this_item_id, this_item_content, this_item_complainedId } = req.body;
        if (this_item_complainedId === String(req.user.id)) {
            const complain = await Complain.findOne({ where: { id: this_item_id, complainedId: req.user.id, content: this_item_content }, });
            res.render('edit_cs.html', {
                complain,
            });
        } else {
            res.send(`<script type="text/javascript">alert("수정 권한이 없습니다."); location.href="/customer/complain/${this_item_id}";</script>`);
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0507 고객문의 게시물 내용 수정하기
router.post('/edit_complain', isLoggedIn, async (req, res, next) => {
    try {
        console.log("/customer/edit_complain 진입");

        const { this_item_id, complainTitle, complainAbout } = req.body;
        await Complain.update({
            title: complainTitle,
            content: complainAbout,
        }, {
            where: { id: this_item_id }
        });

        res.send(`<script type="text/javascript">alert("커뮤니티 정보 수정 완료"); location.href="/customer/complain/${this_item_id}";</script>`); // 등록 하고 자기가 등록한 책 화면 띄우게 하기
    } catch (error) {
        console.error(error);
        next(error);
    }
});


module.exports = router;