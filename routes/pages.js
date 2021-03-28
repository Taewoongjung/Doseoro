const express = require('express');

const router = express.Router();

router.get('/findID', (req, res) => {
    res.render('findID.html');
});

router.get('/findPW', (req, res) => {
    res.render('findPW.html');
});

router.get('/changePW', (req, res) => {
    res.render('changePW.html');
})

module.exports = router;