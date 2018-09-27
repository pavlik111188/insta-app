const express = require('express');
const router = express.Router();
const passport	= require('passport');
const nodemailer	= require('nodemailer');
const jwt       = require('jwt-simple');
const moment    = require('moment');
const async    = require('async');
const crypto    = require('crypto');
const bcrypt    = require('bcrypt');
const app = express();
const config = require('../config/database'); // get db config file
const User = require('../models/user'); // get the mongoose model
const Role = require('../models/roles'); // get the mongoose model
const History = require('../models/histories'); // get the mongoose model
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// test
router.get('/test', function ( req, res, next) {
   res.send('TEST page is working!!!');
   console.log('Worked!');
});

router.post('/forgot_pass', function ( req, res, next) {
    async.waterfall([
        function(done) {
            User.findOne({
                email: req.body.email
            }).exec(function(err, user) {
                if (user) {
                    done(err, user);
                } else {
                    // done('User not found.');
                    res.status(403).json({success: false, error: 'User not found.'});
                }
            });
        },
        function(user, done) {
            // create the random token
            crypto.randomBytes(20, function(err, buffer) {
                let token = buffer.toString('hex');
                done(err, user, token);
            });
        },
        function(user, token, done) {
            User.findByIdAndUpdate({ _id: user._id }, {
                reset_password_token: token,
                reset_password_expires: Date.now() + 86400000
            }, { upsert: true, new: true }).exec(function(err, new_user) {
                done(err, token, new_user);
            });
        },
        function(token, user, done) {
            const transporter = nodemailer.createTransport({
                host: 'mail.adm.tools',
                port: 2525,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: 'admin@pr-web.com.ua', // generated ethereal user
                    pass: '8u913TlaIGbB' // generated ethereal password
                }
            });
            const mailOptions = {
                from: 'admin@pr-web.com.ua', // sender address
                to: user.email, // list of receivers
                subject: 'Password help has arrived! ✔', // Subject line
                text: 'Hello ' + user.first_name, // plain text body
                html: '<h3>Dear ' + user.first_name + ',</h3>' +
                '<p>You requested for a password reset, kindly use this ' +
                '<a href="http://localhost:4200/reset_password/' + token + '" data-saferedirecturl="http://localhost:4200/reset_password/' + token + '">link</a>' +
                ' to reset your password</p>'
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (!error) {
                    res.status(200).json({ token: token });
                }
            });
        }
    ], function(err) {
        return res.status(422).json({ message: err });
    });
});

router.post('/signup', function( req, res, next ) {
    if (!req.body.email || !req.body.password) {
        res.json({success: false, msg: 'Please pass name and password.'});
    } else {
        var newUser = new User({
            first_name: req.body.first_name,
            email: req.body.email,
            password: req.body.password,
            role: 'user',
            money: 25.45,
            purse_address: req.body.email
        });
        // Save the user
        newUser.save(function(err) {
            if (err) {
                return res.json({success: false, msg: 'User email already exists.', error: err });
            }
            res.json({success: true, msg: 'Successful created new user.'});
        });
    }
});

router.post('/login', function( req, res, next ) {
    User.findOne({
        email: req.body.email
    }, function( err, user ) {
        if (err) throw err;

        if (!user) {
            res.send({success: false, msg: 'Authentication failed. User not found:' + user });
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // Token expires in X day
                    var expires = moment().add(7, 'days').valueOf();
                    // if user is found and password is right create a token
                    var token = jwt.encode({user, expires}, config.secret);
                    // return the information including token as JSON
                    res.json({success: true, token: 'JWT ' + token,
                        user: {
                            id: user.id,
                            first_name: user.first_name,
                            email: user.email,
                            role: user.role
                        }
                    });
                } else {
                    res.send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
});

router.get('/check_token/:token', function(req, res, next) {
    if (req.params.token) {
        User.findOne({
            reset_password_token: req.params.token
        }, function(err, user) {
            if (err) throw err;
            if (!user) {
                return res.status(403).send({success: false, msg: 'Incorrect token.'});
            } else {
                res.json({success: true, email: user.email, msg: 'correct token'});
            }
        });
    }
});

router.post('/reset_pass', function(req, res, next) {
    if (req.body.token) {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(req.body.password, salt, function (err, hash) {
                req.body.password = hash;
                User.findOneAndUpdate({
                    reset_password_token: req.body.token,
                    email: req.body.email
                }, {
                    reset_password_token: '',
                    reset_password_expires: Date.now() + 86400000,
                    password: req.body.password
                }, (err, user) => {
                    if (err) throw err;
                    if (!user) {
                        return res.status(403).send({success: false, msg: 'Incorrect token.'});
                    } else {
                        res.json({success: true, email: user.email, msg: 'correct token'});
                    }
                });
            });
        });
    }
});

router.get('/user', function(req, res, next) {
    var token = getToken(req.headers.authorization);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            email: decoded.user.email
        }, function(err, user) {
            if (err) throw err;
            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                res.json({success: true, user: user});
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
});

router.get('/history', function(req, res, next) {
    var token = getToken(req.headers.authorization);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            email: decoded.user.email
        }, function(err, user) {
            if (err) throw err;
            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                History.find(
                    { $or:[ {sender: decoded.user.email}, {getter: decoded.user.email} ]},
                    function(err, history) {
                        if (err) throw err;
                        if (!history) {
                            res.json({success: false, msg: 'no items'});
                        } else {
                            res.json({success: true, history: history});
                        }
                    }
                );
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
});

router.post('/balance', function(req, res, next) {
    var token = getToken(req.headers.authorization);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOneAndUpdate({ purse_address: req.body.purse_address }, { $inc: { money: req.body.balance } }, {new: true },function(err, resp) {
            var userGetter = resp;
            if (err) {
                res.json({success: false, msg: 'Incorrect purse address.'});
            } else {
                User.findOneAndUpdate({ _id: decoded.user._id }, {money: req.body.curr_balance}, (err, response) => {
                    if (err) {
                        return res.status(403).send({success: false, msg: err});
                    } else {
                        var history = new History({
                            sender: decoded.user.email,
                            getter: userGetter.email,
                            balance: req.body.balance
                        });
                        // Save the user
                        history.save(function(error) {
                            if (error) {
                                res.json({success: false, msg: error});
                            } else {
                                res.json({success: true, user: response});
                            }
                        });
                    }
                });
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
});

router.get('/role', passport.authenticate('jwt', { session: false}), function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        Role.findOne({
            _id: decoded.user.role
        }, function(err, role) {
            if (err) throw err;

            if (!role) {
                return res.status(403).send({success: false, msg: 'Authentication failed. '});
            } else {
                res.json({success: true, role: role});
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
});

server.listen(4300);

// socket io
io.on('connection', (socket) => {

    console.log('user connected');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('message', (message) => {
        console.log("Message Received: ", message);
        io.emit('message', {type:'new-message', text: message});
    });
});

//Token for user authorization
getToken = function (headers) {
    if (headers) {
        var parted = headers.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

module.exports = router;
