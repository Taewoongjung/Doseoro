const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { User, Book, Who } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => { // 모든 라우터에 회원정보 넣어주기
    res.locals.user = req.user;
    // res.locals.like = 0;  // 좋아요 기능 추가 전
    next();
});

router.get('/', async (req, res, next) => {
    try {
        const books = await Book.findAll({ where: { SoldId: null } });
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

router.get('/like', async (req, res, next) => {
    try {
        const books = await Book.findAll({ where: { SoldId: null } });
        res.render('likedProduct.html', {
            books,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0331파일 올리기 
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
    limits: { fileSize: 5 * 1024 * 1024},  // 파일 크기 제한 ( 나중에 논의 )
});

// 0330 책 등록
// 0331 이미지 등록
router.post('/book', isLoggedIn, upload.single('img'), async (req, res, next) => {
    try {
        const { postmessage, title, price, author, publisher, checkCategory, checkState , dealRoot, about } = req.body;
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
        });
        res.send(`<script type="text/javascript">alert("책 등록 완료"); location.href="/book/${book.id}";</script>`); // 등록 하고 자기가 등록한 책 화면 띄우게 하기
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/book/:id', async (req, res, next) => {
    try {
        const [ book ] = await Promise.all([
            Book.findOne({
                where: { id: req.params.id },
                include: {
                    model: User,
                    as: 'Owner',
                },
            }),
        ]);
        res.render('saleDetail.html', {
            title: `책 구경`,
            book,
            // user: req.user.id,  현재 사용자의 아이디 찍어주는 것
            user: book.OwnerId,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 찜 하기 기능
router.post('/like', isLoggedIn, async (req, res, next) => {
    try {
        const { user, postTitle } = req.body;
        const FindBook = await Book.findOne({ where: { id: user } });
        await Who.create({
            thisbook: user,
            posttitle: postTitle,
            liked: req.user.id,
        });
        await Book.update({
            likecount: FindBook.likecount + 1,
        }, {
            where: { id: user }
        });
        return res.send(`<script type="text/javascript">alert("찜 했습니다!"); location.href="/";</script>`);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0327 판매 게시판, 판매 게시물 등록
router.get('/saleBoard', isNotLoggedIn, (req, res) => {
    res.render('saleBoard.html');
});

module.exports = router;