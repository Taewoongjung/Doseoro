const express = require('express');
const moment = require('moment-timezone');
const sequelize = require("sequelize");
const Op = sequelize.Op;

const { User, Book, Who, Post, Community } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => { // 모든 라우터에 회원정보 넣어주기
    res.locals.user = req.user;
    next();
});

// 0410 구매내역 등록
router.post('/thisbook', isLoggedIn, async (req, res, next) => {
    try {
        console.log("wannabuy/thisbook 진입");

        const { postmessage, title, price, author, publisher, checkCategory, dealRoot, about } = req.body;
        const book = await Book.create({
            OwnerId: req.user.id,
            postmessage: postmessage,
            title: title,
            author: author,
            publisher: publisher,
            category: checkCategory,
            price: price,
            tradingmethod: dealRoot,
            about: about,
            usernick: req.user.nick,
            isSelling: '1',
        });
        res.send(`<script type="text/javascript">alert("책 등록 완료"); location.href="/wannabuy/buybook/${book.id}";</script>`); // 등록 하고 자기가 등록한 책 화면 띄우게 하기
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0410 구매내역 삭제
router.get('/delete', isLoggedIn, async (req, res, next) => {
    try {
        console.log("wannabuy/delete 진입");

        const { this_item_id, this_item_OwnerId } = req.query;
        if (this_item_OwnerId === String(req.user.id)) {
            await Book.destroy({ where: { id: this_item_id, OwnerId: this_item_OwnerId, isSelling: '1' }, });
            res.send(`<script type="text/javascript">alert("게시물 삭제 완료!"); location.href="/pages/bookRequest";</script>`);
        } else {
            return res.send(`<script type="text/javascript">alert("삭제 권한이 없습니다."); location.href="/wannabuy/buybook/${this_item_id}";</script>`);
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0507 구매내역 삭제(마이페이지에서)
router.get('/delete_myPage', isLoggedIn, async (req, res, next) => {
    try {
        console.log("wannabuy/delete_myPage 진입");

        const { this_item_id, this_item_OwnerId } = req.query;
        if (this_item_OwnerId === String(req.user.id)) {
            await Book.destroy({ where: { id: this_item_id, OwnerId: this_item_OwnerId, isSelling: '1' }, });
            res.send(`<script type="text/javascript">alert("게시물 삭제 완료!"); location.href="/pages/myPostingList";</script>`);
        } else {
            return res.send(`<script type="text/javascript">alert("삭제 권한이 없습니다."); location.href="/wannabuy/buybook/${this_item_id}";</script>`);
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0410 구매내역 창에 수정을 누르면 나오는 수정하는 창을 띄어주는 라우터
router.post('/editIt', isLoggedIn, async (req, res, next) => {
    try {
        console.log("wannabuy/editIt 진입");

        const { this_item_OwnerId, this_item_id } = req.body;
        if (this_item_OwnerId === String(req.user.id)) {
            const books = await Book.findOne({ where: { id: this_item_id, isSelling: '1' } });
            console.log("books = ", books);
            res.render('edit_buyDetail.html', {
                books,
            });
        } else {
            return res.send(`<script type="text/javascript">alert("수정 권한이 없습니다."); location.href="/wannabuy/buybook/${this_item_id}";</script>`);
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 구매요청 게시물 수정하기
router.post('/edit', isLoggedIn, async (req, res, next) => {
    try {
        console.log("wannabuy/edit 진입");

        const { this_item_id, postmessage, title, price, author, publisher, checkCategory, dealRoot, about } = req.body;
        const a = await Book.update({
            postmessage: postmessage,
            title: title,
            author: author,
            publisher: publisher,
            category: checkCategory,
            price: price,
            tradingmethod: dealRoot,
            about: about,
        }, {
            where: { id: this_item_id, isSelling: '1' }
        });

        res.send(`<script type="text/javascript">alert("구매하기 정보 수정 완료"); location.href="/wannabuy/buybook/${this_item_id}";</script>`); // 등록 하고 자기가 등록한 책 화면 띄우게 하기
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0411 구매 책 디테일
router.get('/buybook/:id', async (req, res, next) => {
    try {
        console.log("wannabuy/buybook/:id 진입");

        const [book] = await Promise.all([
            Book.findOne({
                where: { id: req.params.id },
                include: {
                    model: User,
                    as: 'Owner',
                },
            }),
        ]);

        const plus_hits = book.hits + 1; // 조회수 +1
        console.log("hit = ", plus_hits);

        await Book.update({
            hits: plus_hits,
        }, {
            where: { id: req.params.id }
        });

        const [user] = await Promise.all([
            User.findOne({
                where: { id: book.OwnerId }
            }),
        ]);

        const [comments] = await Promise.all([
            Post.findAll({
                where: {
                    BookId: req.params.id,
                    reCommentedId: null,
                },
                include: {
                    model: User,
                    as: 'Commenting',
                },
                order: [['createdAt', 'DESC']],
            }),
        ]);

        const findcommentId = [];
        for (const find_commentId of comments) {
            const { id } = find_commentId;
            findcommentId.push(id);
        }

        // 대댓글
        const [re_comments] = await Promise.all([
            Post.findAll({
                where: {
                    BookId: req.params.id,
                    reCommentingId: {
                        [Op.in]: findcommentId,
                    },
                },
                order: [['createdAt', 'ASC']],
            }),
        ]);

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

        //////////// 알림 ////////////
        if (res.locals.user) {
            console.log("login");
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

            res.render('buyDetail.html', {
                title: `책 구매`,
                book,
                createdAt: moment(book.createdAt).format('YYYY.MM.DD HH:mm'),
                users: res.locals.user,
                user: book.OwnerId,
                bookId: req.params.id,
                comments: time,
                re_comments: re_time,
                comment_createdAt: moment(comments.createdAt).format('YYYY.MM.DD HH:mm'),
                this_book_location: user.location,
                noticess,
                likesfornotice,
            });
        } else if (isNotLoggedIn) {
            console.log("not login");
            res.render('buyDetail.html', {
                title: `책 구매`,
                book,
                createdAt: moment(book.createdAt).format('YYYY.MM.DD HH:mm'),
                user: book.OwnerId,
                comments: time,
                re_comments: re_time,
                this_book_location: user.location,
            });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0411 댓글기능
router.post('/buybook/:id/comment', isLoggedIn, async (req, res, next) => {
    try {
        console.log("wannabuy/buybook/:id/comment 진입");

        const { comment, bookId } = req.body;
        console.log("comment = ", comment);
        const post = await Post.create({
            content: comment,
            commentingNick: req.user.nick,
            UserId: req.user.id,
            BookId: req.params.id,
            thisURL: String(`/wannabuy/buybook/${bookId}`),
        });
        return res.send(`<script type="text/javascript">location.href="/wannabuy/buybook/${post.BookId}";</script>`);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0421 대댓글 기능 (구매)
router.post('/recomment', isLoggedIn, async (req, res, next) => {
    try {
        console.log("wannabuy/recomment 진입");

        const { comment, bookId, commentId } = req.body;
        const post = await Post.create({
            content: comment,
            UserId: req.user.id,
            BookId: bookId,
            reCommentingId: commentId,
            reCommentedId: req.user.id,
            reCommentNick: req.user.nick,
            thisURL: String(`/wannabuy/buybook/${bookId}`),
        });
        return res.send(`<script type="text/javascript">location.href="/wannabuy/buybook/${post.BookId}";</script>`);
    } catch (error) {
        console.error(error);
        next(error);
    }
});


module.exports = router;