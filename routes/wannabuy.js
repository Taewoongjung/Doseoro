const express = require('express');
const moment = require('moment-timezone');
const sequelize = require("sequelize");
const Op = sequelize.Op;

const { User, Book, Who, Post } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => { // 모든 라우터에 회원정보 넣어주기
    res.locals.user = req.user;
    next();
});

// 0410 구매내역 등록
router.post('/thisbook', isLoggedIn, async (req, res, next) => {
    try {
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
        const { this_item_id, this_item_createdAt, this_item_OwnerId } = req.query;
        if (this_item_OwnerId === String(req.user.id)) {
            await Book.destroy({ where: { id: this_item_id, createdAt: this_item_createdAt, OwnerId: this_item_OwnerId, isSelling: '1' }, });
            res.send(`<script type="text/javascript">alert("게시물 삭제 완료!"); location.href="/pages/bookRequest";</script>`);
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
        const { this_item_id, postmessage, title, price, author, publisher, checkCategory, dealRoot, about } = req.body;
        console.log("body = ", req.body);
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
        const [book] = await Promise.all([
            Book.findOne({
                where: { id: req.params.id },
                include: {
                    model: User,
                    as: 'Owner',
                },
            }),
        ]);
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
            // const { createdAt, commentingNick, id, content, UserId, BookId, reCommentedId, reCommentingId, reCommentNick } = find_commentId;
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
        console.log("대댓글 = ", re_comments);
        console.log("대댓글 테스트 = ", String(findcommentId));

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
        if (res.locals.user) {
            console.log("login");
            res.render('buyDetail.html', {
                title: `책 구매`,
                book,
                createdAt: moment(book.createdAt).format('YYYY-MM-DD HH:mm:ss'),
                users: res.locals.user,
                user: book.OwnerId,
                bookId: req.params.id,
                comments: time,
                re_comments: re_time,
                comment_createdAt: moment(comments.createdAt).format('YYYY-MM-DD HH:mm:ss'),
                this_book_location: user.location,
            });
        } else if (isNotLoggedIn) {
            console.log("not login");
            res.render('buyDetail.html', {
                title: `책 구매`,
                book,
                createdAt: moment(book.createdAt).format('YYYY-MM-DD HH:mm:ss'),
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
        console.log("@!@!@@", req.body);
        const { comment, bookId, commentId } = req.body;
        console.log("@!@!@@ = ", commentId);
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