const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sequelize = require("sequelize");
const Op = sequelize.Op;

const { User, Book, Who, Post } = require('../models');
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

        const [books] = await Promise.all([
            Book.findAll({
                where: { SoldId: null, isSelling: null }
            })
        ]);
        res.render('index.html', {
            books,
        });
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
const upload2 = multer();
router.post('/book/:id/comment', isLoggedIn, upload2.none(), async (req, res, next) => {
    try {
        const { comment } = req.body;
        const post = await Post.create({
            content: comment,
            commentingNick: req.user.nick,
            UserId: req.user.id,
            BookId: req.params.id,
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
        const [comments] = await Promise.all([
            Post.findAll({
                where: {
                    BookId: req.params.id
                },
                include: {
                    model: User,
                    as: 'Commenting',
                },
                order: [['createdAt', 'DESC']],
            }),
        ]);
        if (res.locals.user) {
            console.log("login");
            res.render('saleDetail.html', {
                title: `책 구경`,
                book,
                users: res.locals.user,
                user: book.OwnerId,
                img: book.img,
                bookId: req.params.id,
                comments: comments,
            });
        } else if (isNotLoggedIn) {
            console.log("not login");
            res.render('saleDetail.html', {
                title: `책 구경`,
                book,
                user: book.OwnerId,
                comments: comments,
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
        /*
            1. 자신의 물건인 경우
                자신의 물건에는 할 수 없습니다
            2. 자신의 물건이 아닌 경우
                2-1. 좋아요가 이미 눌러진 상태인 경우
                    찜 해제됐습니다
                2-2. 아닌 경우
                    찜 했습니다
        */
        const { user: owner, bookId, createdat, postmessage, title, price } = req.body;
        const isheliked = await Who.findOne({ where: { thisbook: bookId, liked: req.user.id } });
        if ( String(req.user.id) === String(owner) ) {
            return res.send(`<script type="text/javascript">alert("자신의 물건에는 할 수 없습니다."); location.href="/";</script>`);
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
            return res.send(`<script type="text/javascript">alert("찜 해제됐습니다!"); location.href="/";</script>`);
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
            });
            await Book.update({
                likecount: add,
            }, {
                where: { id: bookId }
            });
            return res.send(`<script type="text/javascript">alert("찜 했습니다!"); location.href="/";</script>`);
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0403 검색
// 0404 카테고리 검색
router.get('/search', async (req, res, next) => {
    try {
        console.log("aaaaaaa= ", req.query);
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
                user: foundBooks.OwnerId,
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
                user: foundBooks.OwnerId,
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
                user: foundBooks.OwnerId,
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
                user: foundBooks.OwnerId,
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
                user: foundBooks.OwnerId,
                bookId: req.params.id,
            });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;