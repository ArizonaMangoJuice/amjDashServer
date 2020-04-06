const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const passport = require('passport');

router.get('/', (req, res, next) => {
    Page.find().sort({_id: -1}).limit(9)
        .then(result => res.json(result))
        .catch(err => next(err));
});

router.get('/:title', (req, res, next) => {
    let {title} = req.params
    console.log(title)
    Page.find({title: title})
        .then(result => {
            console.log(result)
            res.json(result)
        })
        .catch(error => next(error))
})

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
        .catch(err => {
            // console.log(err.code);
            res.status(400)
            let error = new Error()
            console.log(error)
            // return next(err)
            res.json({
                message: 'title is already used',
                status: 400
            })
        });
})

module.exports = router;