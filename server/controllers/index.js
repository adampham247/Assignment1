let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');
let DB = require('../config/db');
let userModel = require('../models/user');
let User = userModel.User;


// check if the user is already logged in
module.exports.displayLoginPage = (req, res, next) => {
    if(!req.user){
        res.render('auth/login',{
            title: "Login",
            messages: req.flash('loginMessage'),
            displayName : req.user ? req.user.displayName: ''
        })
    }else{
        return res.redirect('/');
    }
};

module.exports.processLoginPage = (req, res, next) => {
    passport.authenticate('local',
    (err,user,info) => {
        if (err){
            return next(err);
        }
        if (!user){
            req.flash('loginMessage', 'Authorization Error');
            return res.redirect('/login', );
        }
        req.login(user,(err) =>{
            if(err){
                return next(err);
            }
            return res.redirect('/business');
        });
    })(req, res, next);}


module.exports.displayRegisterPage = (req, res, next) => {
    if(!req.user){
        res.render('auth/register',{
            title: "Register",
            messages:req.flash('registerMessage'),
            displayName:req.user ? req.user.displayName :''
        })
    }else{
        return res.redirect('auth/login');
    }
};

module.exports.processRegisterPage = (req, res, next) => {
    // instantiate a user object
    let newUser = new User({
        'username': req.body.username,
        'password': req.body.password,
        'email': req.body.email,
        'displayName': req.body.displayName
    });

    User.register(newUser, req.body.password, (err) => {
        if(err)
        {
            console.log("Error: Inserting New User");
            if(err.name == "UserExistsError")
            {
                req.flash(
                    'registerMessage',
                    'Registration Error: User Already Exists!'
                );
                console.log('Error: User Already Exists!')
            }
            return res.render('auth/register',
            {
                title: 'Register',
                messages: req.flash('registerMessage'),
            });
        }
        else
        {
            return passport.authenticate('local')(req, res, () => {
                res.redirect('/business')
            });
        }
    });
}
module.exports.performLogout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};