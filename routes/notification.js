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

router.get('/witoutCommu', isLoggedIn, async(req, res, next) => {
    try{
        const { notCommunity_Id, to } = req.query;
        console.log("@!@!@!@!@@ ", req.path);
        await Post.update({
            isNotified_posts: '1',
        }, {
            where:{
                id: notCommunity_Id,
            },
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/onlyCommu', isLoggedIn, async(req, res, next) => {
    try{
        const { community_Id } = req.query;
        await Post.update({
            isNotified_posts: '1',
        }, {
            where:{
                id: community_Id,
            },
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/notyLike', isLoggedIn, async(req, res, next) => {
    try{
        const { Like_Id } = req.query;
        await Who.update({
            isNotified_like: '1',
        }, {
            where:{
                id: Like_Id,
            },
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/deleteAll', isLoggedIn, async(req, res, next) => {
    try{
        console.log("deleteAll 진입");
        const [books_for_notice] = await Promise.all([ // 내가 올린 책 모두 찾기
            Book.findAll({
                where: {
                    OwnerId: req.user.id,
                }
            })
        ]);

        const [books_for_notice_commu] = await Promise.all([ // 내가 올린 커뮤니티 글 모두 찾기
            Community.findAll({
                where: {
                    postingId: req.user.id,
                }
            })
        ]);

        const notices = [];  // 다 찾은 내가 올린 책의 아이디만 따로 빼오기
        for (const notice of books_for_notice) {
            const { id } = notice;
            notices.push(id);
        }

        const [likesfornotice] = await Promise.all([ // 나의 게시물에 좋아요 누른 사람들 모두 찾기
            Who.findAll({
                where: {
                    thisbook: notices,
                    isNotified_like: {
                        [Op.ne]: '1'
                    },
                }
            })
        ]);

        const notices_commu = []; // 다 찾은 내가 올린 커뮤니티 글의 아이디만 따로 빼오기
        for (const notice of books_for_notice_commu) {
            const { id } = notice;
            notices_commu.push(id);
        }

        const [noticess] = await Promise.all([
            Post.findAll({
                where: {
                    [Op.or]: [
                        {// 댓글
                            BookId: notices,
                            UserId: { [Op.ne]: String(req.user.id) } // 내 자신이 단 댓글은 표시하면 안되니깐
                        }, { // 커뮤니티 댓글 구별
                            CommunityId: notices_commu,
                            UserId: { [Op.ne]: String(req.user.id) } // 내 자신이 커뮤니티에 단 댓글은 표시하면 안되니깐
                        }],
                    isNotified_posts: {
                        [Op.ne]: '1'
                    },
                }
            })
        ]);
        console.log("noticess = ", noticess);

        const notices_like = []; // 좋아요 누른 사람들에 대한 Who 테이블의 모든 아이디
        for (const likeNoty of likesfornotice) {
            const { id } = likeNoty;
            notices_like.push(id);
        }

        const notices_comments = []; // 좋아요 누른 사람들에 대한 Post 테이블의 모든 아이디
        for (const commentNoty of noticess) {
            const { id } = commentNoty;
            notices_comments.push(id);
        }
        const [aa] = await Promise.all([
            Who.update({
                isNotified_like: '1',
            }, {
                where:{
                    id: notices_like,
                },
            })
        ]);
        console.log("a = ", aa);
        const [bb] = await Promise.all([
            Post.update({
                isNotified_posts: '1',
            }, {
                where:{
                    id: notices_comments,
                },
            })
        ]);

        console.log("b = ", bb);
        // return res.send(`<script type="text/javascript">location.href="/";</script>`);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 해당 알람 클릭하면 그 url로 리다이렉팅 + 알람 사라짐 (답글)
router.get('/witoutCommu_first_click', isLoggedIn, async(req, res, next) => {
    try{
        console.log("@!@! eaa");
        const { notCommunity_Id, theURL } = req.query;
        console.log("body = ", req.query);
        await Post.update({
            isNotified_posts: '1',
        }, {
            where:{
                id: notCommunity_Id,
            },
        });
        return res.send(`<script type="text/javascript">location.href="https://doseoro.taewoongjung.xyz${theURL}";</script>`);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 해당 알람 클릭하면 그 url로 리다이렉팅 + 알람 사라짐 (커뮤니티, 댓글)
router.get('/onlyCommu_first_click', isLoggedIn, async(req, res, next) => {
    try{
        console.log("@!@! eaa");
        const { community_Id, theURL } = req.query;
        console.log("body = ", req.query);
        await Post.update({
            isNotified_posts: '1',
        }, {
            where:{
                id: community_Id,
            },
        });
        return res.send(`<script type="text/javascript">location.href="https://doseoro.taewoongjung.xyz${theURL}";</script>`);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 해당 알람 클릭하면 그 url로 리다이렉팅 + 알람 사라짐 (댓글)
router.get('/witoutCommu_second_click', isLoggedIn, async(req, res, next) => {
    try{
        console.log("@!@! eaa");
        const { notCommunity_Id, theURL } = req.query;
        console.log("body = ", req.query);
        await Post.update({
            isNotified_posts: '1',
        }, {
            where:{
                id: notCommunity_Id,
            },
        });
        return res.send(`<script type="text/javascript">location.href="https://doseoro.taewoongjung.xyz${theURL}";</script>`);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 해당 알람 클릭하면 그 url로 리다이렉팅 + 알람 사라짐 (좋아요)
router.get('/notyLike', isLoggedIn, async(req, res, next) => {
    try{
        const { Like_Id } = req.query;
        await Who.update({
            isNotified_like: '1',
        }, {
            where:{
                id: Like_Id,
            },
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;