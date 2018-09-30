const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongo = require('mongodb');
const mongoose = require('mongoose');
//'mongodb+srv://wikAdmin:' + process.env.MONGO_ATLAS_PW + '@royscluster-7svan.mongodb.net/rowiki?retryWrites=true', {useNewUrlParser:true}
//mongoose.connect('mongodb://localhost/loginapp');
mongoose.connect('mongodb+srv://carAppUser:' + 'carapp' + '@royscluster-7svan.mongodb.net/authSandbox?retryWrites=true', {useNewUrlParser:true})
const db = mongoose.connection;

const routes = require('./routes/index');
const users = require('./routes/users');

//Init app
const app = express();

//View engine
app.set('views', path.join(__dirname,'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//Set static folder
app.use(express.static(path.join(__dirname,'public')));

//Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

//Passport init
app.use(passport.initialize());
app.use(passport.session());

//Express Validator
app.use(expressValidator({
    errorFormatter: function (param, msg, valuse) {
        let namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;
        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
          param: formParam,
          msg: msg,
          value: valuse
        };
    }
}));

//Connect Flash
app.use(flash());

//global vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.use('/', routes);
app.use('/users', users);

//set port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function (){
    console.log('Server started on port ' +app.get('port'));
})