const router = require('express').Router();
const User = require('../models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
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

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function (err, user) {
            if(err) throw err;
            if(!user){
                return done(null, false, {message: 'Unknown User'});
            }
        User.comparePassword(password, user.password, function (err, isMatch) {
            if(err) throw err;
            if(isMatch){
                return done(null, user);
            } else {
                return done(null, false, {message: 'Invalid password'});
            }
        });
        });
    }));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err,user);
    });
});

router.post('/login',
    passport.authenticate('local',{successRedirect:'/', failureRedirect: '/users/login', failureFlash: true}),
    function(req, res) {
        res.redirect('/');
    });


router.get('/logout', function (req,res) {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login')
})

module.exports = router;