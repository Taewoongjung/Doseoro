// mp means mypage
const express = require('express');
const multer = require('multer');
const path = require('path');

const { Book, Who } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => { // 모든 라우터에 회원정보 넣어주기
    res.locals.user = req.user;
    next();
});

// 0407 판매내역 삭제
router.get('/delete', isLoggedIn, async (req, res, next) => {
    try {
        console.log("mpfunc/delete 진입");

        const { this_item_id, this_item_createdAt, this_item_OwnerId } = req.query;
        await Book.destroy({ where: { id: this_item_id, createdAt: this_item_createdAt, OwnerId: this_item_OwnerId }, });
        await Who.destroy({ where: { thisbook: this_item_id } });
        res.send(`<script type="text/javascript">alert("게시물 삭제 완료!"); location.href="/pages/myPostingList";</script>`);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0407 판매내역 삭제
router.get('/deleteInDetail', isLoggedIn, async (req, res, next) => {
    try {
        console.log("mpfunc/deleteInDetail 진입");

        const { this_item_OwnerId, this_item_id } = req.query;
        if (this_item_OwnerId === String(req.user.id)) {
            await Book.destroy({ where: { id: this_item_id, OwnerId: this_item_OwnerId }, });
            await Who.destroy({ where: { thisbook: this_item_id } });
            res.send(`<script type="text/javascript">alert("게시물 삭제 완료!"); location.href="/";</script>`);
        } else {
            return res.send(`<script type="text/javascript">alert("삭제 권한이 없습니다."); location.href="/book/${this_item_id}";</script>`);
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0407 판매내역 창에 수정을 누르면 나오는 수정하는 창을 띄어주는 라우터
router.post('/editIt_A', isLoggedIn, async (req, res, next) => {
    try {
        console.log("mpfunc/editIt_A 진입");

        const { this_item_OwnerId, this_item_id } = req.body;
        if (this_item_OwnerId === String(req.user.id)) {
            const books = await Book.findOne({ where: { id: this_item_id } });
            res.render('edit_saleDetail.html', {
                books,
            });
        } else {
            return res.send(`<script type="text/javascript">alert("수정 권한이 없습니다."); location.href="/book/${this_item_id}";</script>`);
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0418 무료나눔 창에 수정을 누르면 나오는 수정하는 창을 띄어주는 라우터
router.post('/editIt_B', isLoggedIn, async (req, res, next) => {
    try {
        console.log("mpfunc/editIt_B 진입");

        const { this_item_OwnerId, this_item_id } = req.body;
        if (this_item_OwnerId === String(req.user.id)) {
            const books = await Book.findOne({ where: { id: this_item_id } });
            res.render('edit_freeDetail.html', {
                books,
            });
        } else {
            return res.send(`<script type="text/javascript">alert("수정 권한이 없습니다."); location.href="/book/${this_item_id}";</script>`);
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
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

// 0407 수정내용을 저장하는 라우터
// 0408 오류 수정
router.post('/edit', isLoggedIn, upload.array('img', 5 ), async (req, res, next) => {
    try {
        console.log("mpfunc/edit 진입");

        const { this_item_id, postmessage, title, price, author, publisher, checkCategory, checkState, dealRoot, about } = req.body;

        const notices = [];
        for (const imgs of req.files) {
            const { filename } = imgs;
            notices.push(filename);
        }

        await Book.update({
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
        }, {
            where: { id: this_item_id }
        });

        await Who.update({
            thisbook: this_item_id,
            posttitle: postmessage,
            title: title,
            img: notices,
            price: price,
        }, {
            where: { thisbook: this_item_id }
        });

        res.send(`<script type="text/javascript">alert("책 정보 수정 완료"); location.href="/book/${this_item_id}";</script>`); // 등록 하고 자기가 등록한 책 화면 띄우게 하기
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0616 유저의 위치 등록
router.get('/location', async (req, res, next) => {
    try {
        console.log("mpfunc/location 진입");

        const { region1, region2, region3, wholeRegion } =req.query;
        console.log(" region1 = ", region1);    // 도
        console.log(" region2 = ", region2);    // 시/구
        console.log(" region3 = ", region3);    // 동/리
        console.log(" wholeRegion = ", wholeRegion);    // 전체
        
        await User.update({
            location: wholeRegion,
            do: region1,
            si: region2,
            dong: region3,
        }, {
            where: { id: res.locals.user.id }
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

module.exports = router;