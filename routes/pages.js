const express = require('express');

const router = express.Router();

router.get('/findID', (req, res) => {
    res.render('findID.html');
});

router.get('/findPW', (req, res) => {
    res.render('findPW.html');
});


module.exports = router;