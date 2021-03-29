const express = require('express');
// const multer = require('multer');

// const { User, Book } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => { // 모든 라우터에 회원정보 넣어주기 위함
    res.locals.user = req.user;
    next();
});

router.get('/', async (req, res, next) => {
    try {
        res.render('index.html');
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

// router.post('/book', isLoggedIn, upload.single('img'), async (req, res, next) => {
//     try {
//         const { name, price } = req.body;
//         const good = await Good.create({
//             OwnerId: req.user.id,
//             name,
//             img: req.file.filename,
//             price,
//         });
//         const end = new Date();
//         end.setDate(end.getDate() + 1); // 하루 뒤
//         schedule.scheduleJob(end, async () => {
//             const t = await sequelize.transaction();  // transaction으로 묶인것은 같이 행동한다. 
//             try{
//                 const success = await Auction.findOne({
//                     where: { GoodId: good.id },
//                     order: [['bid', 'DESC']],
//                 });
//                 await Good.update({ SoldId: success.UserId }, { where: { id: good.id }, transaction: t });
//                 await User.update({
//                     money: sequelize.literal(`money - ${success.bid}`),
//                 }, {
//                     where: { id: success.UserId },
//                     transaction: t
//                 });
//                 await t.commit();  // 성공하면 commit 호출되게함 
//             } catch (error) {
//                 await t.rollback(); // 셋 중 하나라도 실패하면 셋 다 롤백된다.
//             }
//         });
//         res.redirect('/');
//     } catch (error) {
//         console.error(error);
//         next(error);
//     }
// });

// 0327 판매 게시판, 판매 게시물 등록
router.get('/saleDetail', isNotLoggedIn, (req, res) => {
    res.render('saleDetail.html');
});
router.get('/saleBoard', isNotLoggedIn, (req, res) => {
    res.render('saleBoard.html');
});

router.get('/mypage', isLoggedIn, (req, res) => {
    res.render('myPage.html');
});

module.exports = router;