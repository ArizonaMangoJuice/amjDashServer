const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const passport = require('passport');

router.get('/', (req, res, next) => {
    Page.find({})
        .then(result => res.json(result))
        .catch(err => next(err));
});

// cannot access without authentication
router.use('/', passport.authenticate('jwt', {session: false, failWithError: true}));

// create page 
router.post('/', (req, res, next) => {
    const {
        title,
        linkName,
    } = req.body;

    let userId = req.user._id;
    let page = {};
    page.userId = userId;

    for(key in req.body){
        page[key] = req.body[key]
    }

    if (!title || !linkName) {
        const err = new Error('title or linkName is missing');
        err.status = 400;
        err.location = 'title or linkName is missing';
        return next(err);
    } 

    Page.create(page)
        .then(result => res.json(result))
        .catch(err => next(err));
})

module.exports = router;