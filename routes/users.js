const router = require('express').Router();
const User = require('../models/user');
//register
router.get('/register',function (req,res) {
    res.render('register');
});

//Login
router.get('/login',function (req,res) {
    res.render('login');
});

router.post('/register',function (req,res) {
    let name = req.body.name;
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let password2 = req.body.password2;

    //validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2','Passwords do not match').equals(req.body.password);
    let errors = req.validationErrors();
    if(errors){
        res.render('register',{
           errors: errors
        });
    } else {
        let newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });
        User.createUser(newUser, function (err, user) {
            if(err) throw err;
            console.log(user);
        });
        req.flash('success_msg', 'You are registered and can now login');
        res.redirect('/users/login');
    }
});

module.exports = router;