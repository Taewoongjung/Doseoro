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

router.get('/', async (req, res, next) => {
    try {
        // --------- 인기 순으로 정렬하기 ---------
        //
        // // 좋아요 6개 이상
        // const [hit_books] = await Promise.all([
        //     Book.findAll({
        //         where: { 
        //             likecount: { [Op.gte]: 6 }, 
        //             SoldId: null 
        //         },
        //     })
        // ]);
        // // 좋아요 5개 이하
        // console.log("@@@@@@@@@", hit_books);
        // const [reg_books] = await Promise.all([
        //     Book.findAll({
        //         where: { 
        //             likecount: { [Op.lte]: 5 }, 
        //             SoldId: null 
        //         },
        //     })
        // ]);
        if (req.user) {
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
                notices.push( id );
            }

            const [likesfornotice] = await Promise.all([
                Who.findAll({
                    where: {
                        thisbook: notices,
                    }
                })
            ]);
            console.log("notices 좋아요 = ", likesfornotice);

            const notices_commu = [];
            for (const notice of books_for_notice_commu) {
                const { id } = notice;
                notices_commu.push( id );
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
                            UserId:{[Op.ne]: String(req.user.id)}
                        },{ // 커뮤니티 댓글 구별
                            CommunityId: notices_commu,
                            UserId:{[Op.ne]: String(req.user.id)}
                        }],
                        isNotified_posts: {
                            [Op.ne]: '1'
                        },
                    }
                })
            ]);
            console.log("noticess = ", noticess);
            const [books] = await Promise.all([
                Book.findAll({
                    where: {
                        SoldId: null,
                        isSelling: null,
                        price: {
                            [Op.ne]: -1
                        },
                    }
                })
            ]);

            res.render('index.html', {
                books,
                noticess,
                likesfornotice,
            });
        } else {
            const [books] = await Promise.all([
                Book.findAll({
                    where: {
                        SoldId: null,
                        isSelling: null,
                        price: {
                            [Op.ne]: -1
                        },
                    }
                })
            ]);
            res.render('index.html', {
                books,
            });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('login.html');
});

router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('signup.html');
});

router.get('/mypage', isLoggedIn, (req, res, next) => {
    res.render('myPage.html');
    // if (req.query) {
    //     console.log("@@!!!!");
    //     res.render('myPage.html');
    // }
});

// 0331 파일 올리기 
try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}
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

// 0403 댓글기능
router.post('/book/:id/comment', isLoggedIn, async (req, res, next) => {
    try {
        const { comment, bookId } = req.body;
        const post = await Post.create({
            content: comment,
            commentingNick: req.user.nick,
            UserId: req.user.id,
            BookId: req.params.id,
            thisURL: String(`/book/${bookId}`),
        });
        return res.send(`<script type="text/javascript">location.href="/book/${post.BookId}";</script>`);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0421 대댓글 기능 
router.post('/recomment', isLoggedIn, async (req, res, next) => {
    try {
        console.log("@!@!@@");
        const { comment, UserId, bookId, commentId } = req.body;
        console.log("@!@!@@ = ", commentId);
        console.log("@!@!@@ === ", req.body);
        const post = await Post.create({
            content: comment,
            UserId: req.user.id,
            BookId: bookId,
            reCommentingId: commentId,
            reCommentedId: req.user.id,
            reCommentNick: req.user.nick,
            thisURL: String(`/book/${bookId}`),
        });
        return res.send(`<script type="text/javascript">location.href="/book/${post.BookId}";</script>`);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0330 책 등록
// 0331 이미지 등록
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
            price: price,
            tradingmethod: dealRoot,
            about: about,
            usernick: req.user.nick,
        });
        res.send(`<script type="text/javascript">alert("책 등록 완료"); location.href="/book/${book.id}";</script>`); // 등록 하고 자기가 등록한 책 화면 띄우게 하기
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/book/:id', async (req, res, next) => {
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
        // 그냥 댓글들
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
        // 대댓글들
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
        // console.log("대댓글 = ", re_comments);
        // console.log("대댓글 테스트 = ", String(findcommentId));

        const [free_books] = await Promise.all([
            Book.findAll({
                where: { id: req.params.id, SoldId: null, isSelling: null, price: -1 }
            })
        ]);
        const time = [];
        for (const new_time of comments) {
            const { createdAt, commentingNick, id, content, UserId } = new_time;
            time.push({
                createdAt: moment(createdAt).format('YYYY-MM-DD HH:mm:ss'),
                commentingNick,
                content,
                id,
                UserId,
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
            res.render('saleDetail.html', {
                title: `책 구경`,
                book,
                createdAt: moment(book.createdAt).format('YYYY-MM-DD HH:mm:ss'),
                users: res.locals.user,
                user: book.OwnerId,
                img: book.img,
                bookId: req.params.id,
                comments: time,
                re_comments: re_time,
                free_books,
                this_book_location: user.location,
            });
        } else if (isNotLoggedIn) {
            console.log("not login");
            res.render('saleDetail.html', {
                title: `책 구경`,
                book,
                createdAt: moment(book.createdAt).format('YYYY-MM-DD HH:mm:ss'),
                user: book.OwnerId,
                comments: time,
                re_comments: re_time,
                free_books,
                this_book_location: user.location,
            });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0403 찜 하기 기능
router.post('/like', isLoggedIn, async (req, res, next) => {
    try {
        const { user: owner, bookId, postmessage, title, price, registeredUserNick } = req.body;
        const isheliked = await Who.findOne({ where: { thisbook: bookId, liked: req.user.id } });
        if ( String(req.user.id) === String(owner) ) {
            return res.send(`<script type="text/javascript">alert("자신의 물건에는 할 수 없습니다."); location.href="/book/${bookId}";</script>`);
        }
        else if (isheliked) {
            const FindBook = await Book.findOne({ where: { id: bookId, OwnerId: owner } });
            const add = FindBook.likecount - 1;
            await Who.destroy({ where: { thisbook: FindBook.id, liked: req.user.id } });
            await Book.update({
                likecount: add,
            }, {
                where: { id: bookId }
            });
            return res.send(`<script type="text/javascript">alert("찜 해제됐습니다!"); location.href="/book/${bookId}";</script>`);
        }
        else {
            const FindBook = await Book.findOne({ where: { id: bookId, OwnerId: owner } });
            const add = FindBook.likecount + 1;
            await Who.create({
                thisbook: bookId,
                posttitle: postmessage,
                title: title,
                img: FindBook.img,
                price: price,
                liked: req.user.id,
                likedNick: req.user.nick,
                thisURL: String(`/book/${bookId}`),
            });
            await Book.update({
                likecount: add,
            }, {
                where: { id: bookId }
            });
            return res.send(`<script type="text/javascript">alert("찜 했습니다!"); location.href = "/book/${bookId}"; </script>`);
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/location', async (req, res, next) => {
    try {
        await User.update({
            location: req.query.address,
        }, {
            where: { id: res.locals.user.id }
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

// 0403 검색
// 0404 카테고리 검색
router.get('/search', async (req, res, next) => {
    try {
        if (req.query.searchFilter === 'postTitle') { // 게시물명 으로 찾기
            const [foundBooks] = await Promise.all([
                Book.findAll({
                    where: {
                        postmessage: {
                            [Op.like]: "%" + req.query.searchWord + "%"
                        },
                    },
                }),
            ]);
            res.render('index.html', {
                title: `책 구경`,
                foundBooks,
                user: res.locals.user,
                bookId: req.params.id,
            });
        } else if (req.query.searchFilter === 'bookTitle') {  // 책 이름으로 찾기
            const [foundBooks] = await Promise.all([
                Book.findAll({
                    where: {
                        title: {
                            [Op.like]: "%" + req.query.searchWord + "%"
                        },
                    },
                }),
            ]);
            res.render('index.html', {
                title: `책 구경`,
                foundBooks,
                user: res.locals.user,
                bookId: req.params.id,
            });
        } else if (req.query.searchFilter === 'bookAuther') {  // 책 저자명 으로 찾기
            const [foundBooks] = await Promise.all([
                Book.findAll({
                    where: {
                        author: {
                            [Op.like]: "%" + req.query.searchWord + "%"
                        },
                    },
                }),
            ]);
            res.render('index.html', {
                title: `책 구경`,
                foundBooks,
                user: res.locals.user,
                bookId: req.params.id,
            });
        } else if (req.query.searchFilter === 'bookPublisher') {  // 출판사명 으로 찾기
            const [foundBooks] = await Promise.all([
                Book.findAll({
                    where: {
                        publisher: {
                            [Op.like]: "%" + req.query.searchWord + "%"
                        },
                    },
                }),
            ]);
            res.render('index.html', {
                title: `책 구경`,
                foundBooks,
                user: res.locals.user,
                bookId: req.params.id,
            });
        } else {  // 전체
            const [foundBooks] = await Promise.all([
                Book.findAll({
                    where: {
                        [Op.or]: [
                            {
                                postmessage: {
                                    [Op.like]: "%" + req.query.searchWord + "%"
                                },
                            }, {
                                publisher: {
                                    [Op.like]: "%" + req.query.searchWord + "%"
                                },
                            }, {
                                author: {
                                    [Op.like]: "%" + req.query.searchWord + "%"
                                },
                            }, {
                                title: {
                                    [Op.like]: "%" + req.query.searchWord + "%"
                                },
                            }]
                    },
                }),
            ]);
            res.render('index.html', {
                title: `책 구경`,
                foundBooks,
                user: res.locals.user,
                bookId: req.params.id,
            });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;