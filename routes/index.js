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
        console.log("index/ 진입");

        // --------- 슬라이드에 들어 갈 것들 ---------
        // // 좋아요 6개 이상
        const [rankedBooks] = await Promise.all([
            Book.findAll({
                where: { 
                    likecount: { [Op.gte]: 2 }, 
                    SoldId: null,
                    price: { [Op.ne]: -1 },
                },
                order: [['likecount', 'DESC']],
                limit: 4,
            })
        ]);  
        console.log("hot books = ", rankedBooks);
        // --------------------------------------- 
        
        // 최근 판매한 상품들 (팝니다, 무료나눔)
        const [recentSoldBooks] = await Promise.all([
            Book.findAll({
                where: { 
                    sold: { [Op.eq]: 1 },
                    SoldId: { [Op.ne]: null },
                    // price: { [Op.ne]: -1 },
                    img: { [Op.ne]: null }
                },
                order: [['updatedAt', 'ASC']],
                limit: 4,
            })
        ]);
        console.log("recent sold books = ", recentSoldBooks);

        // 최근 구매한 상품들
        const [recentBoughtBooks] = await Promise.all([
            Book.findAll({
                where: { 
                    sold: { [Op.eq]: 1 },
                    SoldId: { [Op.ne]: null },
                    img: null
                },
                order: [['updatedAt', 'ASC']],
                limit: 4,
            })
        ]);
        console.log("recent bought books = ", recentBoughtBooks);

        //////////// 알림 ////////////
        if (req.user) {
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

            const [books] = await Promise.all([ // index에 팝니다 상품들
                Book.findAll({
                    where: {
                        SoldId: null,
                        isSelling: null,
                        price: {
                            [Op.ne]: -1
                        },
                    },
                    order: [['createdAt', 'DESC']],
                    limit: 4,
                })
            ]);

            const [freeBooksIndex] = await Promise.all([ // index에 무료나눔
                Book.findAll({
                    where: {
                        SoldId: null,
                        isSelling: null,
                        price: -1,
                    },
                    order: [['createdAt', 'DESC']],
                    limit: 4,
                })
            ]);

            const [sellBooksIndex] = await Promise.all([ // index에 무료나눔
                Book.findAll({
                    where: {
                        SoldId: null,
                        isSelling: 1,
                    },
                    order: [['createdAt', 'DESC']],
                    limit: 4,
                })
            ]);

            const [wannabuyBooksIndex] = await Promise.all([ // index에 무료나눔
                Book.findAll({
                    where: {
                        SoldId: null,
                        isSelling: 1,
                    },
                    order: [['createdAt', 'DESC']],
                    limit: 4,
                })
            ]);

            res.render('index.html', {
                books,
                rankedBooks,
                recentSoldBooks,
                freeBooksIndex,
                wannabuyBooksIndex,
                sellBooksIndex,
                noticess,
                likesfornotice,
                user: req.user,
            });
        } else {
            const [books] = await Promise.all([ // index에 팝니다 상품들
                Book.findAll({
                    where: {
                        SoldId: null,
                        isSelling: null,
                        price: {
                            [Op.ne]: -1
                        },
                    },
                    order: [['createdAt', 'DESC']],
                    limit: 4,
                })
            ]);

            const [freeBooksIndex] = await Promise.all([ // index에 무료나눔
                Book.findAll({
                    where: {
                        SoldId: null,
                        isSelling: null,
                        price: -1,
                    },
                    order: [['createdAt', 'DESC']],
                    limit: 4,
                })
            ]);

            const [wannabuyBooksIndex] = await Promise.all([ // index에 무료나눔
                Book.findAll({
                    where: {
                        SoldId: null,
                        isSelling: 1,
                    },
                    order: [['createdAt', 'DESC']],
                    limit: 4,
                })
            ]);

            res.render('index.html', {
                books,
                rankedBooks,
                recentSoldBooks,
                freeBooksIndex,
                wannabuyBooksIndex,
            });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/login', isNotLoggedIn, (req, res) => {
    console.log("index/login 진입");

    res.render('login.html');
});

router.get('/signup', isNotLoggedIn, (req, res) => {
    console.log("index/signup 진입");

    res.render('signup.html');
});

router.get('/tradeHistory', isLoggedIn, async (req, res) => {
    console.log("index/tradeHistory 진입");

    const [boughtBooks] = await Promise.all([
        Book.findAll({
            where: {
                OwnerId: { [Op.eq]: req.user.id },
                sold: { [Op.eq]: 1 },
                state: { [Op.ne]: null }
            }
        })
    ]);

    const [soldBooks] = await Promise.all([
        Book.findAll({
            where: {
                SoldId: { [Op.eq]: req.user.id },
                sold: { [Op.eq]: 1 },
                state: { [Op.ne]: null }
            }
        })
    ]);

    const [boughtBooks_buy] = await Promise.all([
        Book.findAll({
            where: {
                OwnerId: { [Op.eq]: req.user.id },
                SoldId: { [Op.ne]: null },
                state: { [Op.is]: null },
                sold: { [Op.eq]: 1 },
            }
        })
    ]);

    const [soldBooks_buy] = await Promise.all([
        Book.findAll({
            where: {
                SoldId: { [Op.eq]: req.user.id },
                state: { [Op.is]: null },
                sold: { [Op.eq]: 1 },
            }
        })
    ]);

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

    res.render('tradeHistory.html', {
        boughtBooks,
        soldBooks,
        boughtBooks_buy,
        soldBooks_buy,
        noticess,
        likesfornotice,
    });
});

router.get('/mypage', isLoggedIn, async (req, res, next) => {
    console.log("/index/mypage 진입 시 아이디 확인 = ", req.user.id);

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

    res.render('myPage.html', {
        noticess,
        likesfornotice,
    });
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
        console.log("index/book/:id/comment 진입");

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
        console.log("index/recomment 진입");
        const { comment, UserId, bookId, commentId } = req.body;
        console.log("(recomment) req.body === ", req.body);

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
router.post('/book', isLoggedIn, upload.array('img', 5), async (req, res, next) => {
    try {
        console.log("index/book 진입");

        const { postmessage, title, price, author, publisher, checkCategory, checkState, dealRoot, about } = req.body;

        const notices = [];
        for (const imgs of req.files) {
            const { filename } = imgs;
            notices.push(filename);
        }

        const book = await Book.create({
            OwnerId: req.user.id,
            postmessage: postmessage,
            title: title,
            author: author,
            publisher: publisher,
            img: notices,
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
        console.log("index/book/:id 진입");

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
                where: { id: req.params.id, price: -1 }
            })
        ]);
        console.log("free = ", free_books);

        const time = [];
        for (const new_time of comments) {
            const { createdAt, commentingNick, id, content, UserId } = new_time;
            time.push({
                createdAt: moment(createdAt).format('YYYY.MM.DD HH:mm'),
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

            console.log("login");
            res.render('saleDetail.html', {
                title: `책 구경`,
                book,
                createdAt: moment(book.createdAt).format('YYYY.MM.DD HH:mm'),
                users: res.locals.user,
                user: book.OwnerId,
                img: book.img,
                bookId: req.params.id,
                comments: time,
                re_comments: re_time,
                free_books,
                this_book_location: user.location,
                noticess,
                likesfornotice,
            });
        } else if (isNotLoggedIn) {
            console.log("not login");
            res.render('saleDetail.html', {
                title: `책 구경`,
                book,
                createdAt: moment(book.createdAt).format('YYYY.MM.DD HH:mm'),
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
        console.log("index/like 진입");

        const { user: owner, bookId, postmessage, title, price } = req.body;
        const isheliked = await Who.findOne({ where: { thisbook: bookId, liked: req.user.id } });
        if (String(req.user.id) === String(owner)) {
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

module.exports = router;