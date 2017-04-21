const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const path = require('path');

const { User, Questions } = require('./models');

const app = express();
app.use(cookieParser());
mongoose.Promise = global.Promise;


app.use(passport.initialize());
passport.use(
    new GoogleStrategy({
        clientID:  '586076467304-6uua98ggril15fvn69ge4pbl04c2uhkq.apps.googleusercontent.com',
        clientSecret: process.env.GOOGLE_SECRET_DAVINCI,
        callbackURL: '/api/auth/google/callback'
    },
    (accessToken, refreshToken, profile, cb) => {
        User.findOne({ googleId: profile.id })
            // .exec()
            .then(user => {
                console.log("profile.id and accessToken", profile.id, accessToken);
                if (!user) {
                    console.log("testing create");
                    return User.create({
                        name: profile.displayName,
                        googleId: profile.id,
                        accessToken: accessToken,
                        correctCount: 0,
                        questionCount: 0

                        
                    })
                } 
                return user;     
            })
            .then(user => {
                console.log('will user be array or obj? ', user);
                if( accessToken !== user.accessToken) {
                    return User
                        .findByIdAndUpdate(user._id, {$set: {accessToken:accessToken}}, {new: true})
                        .exec()
                }
                return user;

            })
            .then(user => {
                console.log("USER", user);
                return cb(null, user);
            })
            .catch(err => {
                console.log(err);
            })   
    }
));

passport.use(
    new BearerStrategy(
        (token, done) => {
            console.log("TOKEN IS HERE",token);
            console.log("DONE");
            User.find({accessToken: token}, function(err, user){
                console.log('Token from OAuth',token);
                if(!user.length){
                    console.log("SEARCH FAILED");
                    return done(null, false);
                }
                else {
                    console.log("SEARCH SUCCEEDED");
                    return done(null, User.findOne({ 'accessToken': token }));
            }
            })
            
        }
    )
);

app.get('/api/auth/google',
    passport.authenticate('google', {scope: ['profile']}));

app.get('/api/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login',
        session: false
    }),
    (req, res) => {
        res.cookie('accessToken', req.user.accessToken, {expires: 0});
        res.redirect('/');
    }
);

app.get('/api/auth/logout', (req, res) => {
    req.logout();
    res.clearCookie('accessToken');
    res.redirect('/');
});

app.get('/api/me',
    passport.authenticate('bearer', {session: false}),
    (req, res) => res.json({

        googleId: req.user.googleId
    })
);

app.get('/api/questions',
    passport.authenticate('bearer', {session: false}),
    (req, res) => res.json(['Question 1', 'Question 2'])
);

app.post('/api/loadspanishquestions', passport.authenticate('bearer', {session: false}), (req, res) => {
    let cookie = req.user._conditions.accessToken;
    Questions.find({})
    .limit(9)
    .exec()
    .then(questions => {
        console.log("Questions", questions);
        console.log("Cookie", cookie);
        User.findOneAndUpdate({accessToken: cookie}, {$set:{questionsArray: questions}}, {new: true})  
        .exec()
        .then(_res => {
        //     let firstQuestion = _res.questionsArray[0];
        console.log("RES?", _res);
        return res.status(202).json(_res);
        })
    
    })
});

app.get('/api/firstquestion', passport.authenticate('bearer', {session: false}), (req, res) => {
    console.log('req.user', req.user._conditions.accessToken);
    let cookie = req.user._conditions.accessToken;
    console.log("Correct Cookie?", cookie);
    User
        .findOne({accessToken: cookie})
        .exec()
        .then(user => {
            console.log("User response:",  user);
            let currentQuestion = user.questionsArray[0];
            let response = {
                currentQuestion: currentQuestion,
                correctCount: user.correctCount,
                questionCount: user.questionCount
            }
            console.log("response to firstquestion", response);
            res.json(response);
        })
        .catch(err => {
            console.log("ERROR", err);
        })     
});

app.post('/api/nextquestion/:answer', passport.authenticate('bearer', {session: false}), (req, res) => {

    // let answer = req.body.answer;
    let cookie = req.user._conditions.accessToken;
    let temp = req.params.answer;
    let answerGiven = parseInt(temp.substr(1));
    console.log("answer before parseInt?", temp);

    User.findOne({accessToken: cookie})
    .exec()
    .then(user => {
        // console.log("user on backend", user);
        user.questionCount++;
        let currentQuestion = user.questionsArray[0];

        // Algorithm

        if (answerGiven !== currentQuestion.answer) {
            console.log('wrong answer');
            if(currentQuestion.m > 1) {
                currentQuestion.m = Math.floor(currentQuestion.m / 2);
            }
        } else {
            console.log('correct answer');
            user.correctCount++;
            currentQuestion.m = currentQuestion.m * 2;
            if (currentQuestion.m > user.questionsArray.length) {
                currentQuestion.m = user.questionsArray.length - 1;
            }
        }
        user.questionsArray.splice(0, 1);
        user.questionsArray.splice(currentQuestion.m, 0, currentQuestion);
        // console.log("user.questionsArray should update", user.questionsArray);

        let readyToLevelUp = true;
        for (let i = 0; i < user.questionsArray.length; i++) {
            let question = user.questionsArray[i];
            if (question.m < 4) {
                console.log(`m below 4 on question ${i + 1}`);
                readyToLevelUp = false;
            }

        }

        if (readyToLevelUp === false) {
            user.save(function(err) {
                if (err) {
                    throw err;
                } else {
                    console.log("Testing Save")
                    res.status(202).json({correctCount: user.correctCount, questionCount:
                    user.questionCount, nextQuestion: user.questionsArray[0], levelUp: false});
                }
            })           
        } else {
            Questions.find({})
                .skip(9)
                .limit(9)
                .exec()
                .then(newQuestions => {
                    let nextquestions = newQuestions;
                    let originalQuestions = user.questionsArray;
                    console.log('still see user questions?', user.questionsArray);
                    user.questionsArray = [...nextquestions, ...originalQuestions];
                    console.log('does user.questionsArray now have 20?', user.questionsArray);
                })
                .then(_res => {
                    user.save(function(err) {
                        if (err) {
                            throw err;
                        } else {
                            console.log("Testing Save at the bottom")
                            res.status(202).json({correctCount: user.correctCount, questionCount:
                            user.questionCount, nextQuestion: user.questionsArray[0], levelUp: true});
                        }
                    })
                })
        }

      
    })

    .catch(err => {
                console.log(err);
    }) 
})


// Serve the built client
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Unhandled requests which aren't for the API should serve index.html so
// client-side routing using browserHistory can function
app.get(/^(?!\/api(\/|$))/, (req, res) => {
    const index = path.resolve(__dirname, '../client/build', 'index.html');
    res.sendFile(index);
});

let server;
function runServer(port=3001) {

    return new Promise((resolve, reject) => {
        mongoose.connect('mongodb://user1:user1@ds143900.mlab.com:43900/spaced_rep', function(err){
            if(err) {
                return reject(err);
            }

            server = app.listen(port, () => {
                resolve();
            }).on('error', reject);
        })
    });

}

function closeServer() {
    return new Promise((resolve, reject) => {
        server.close(err => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

if (require.main === module) {
    runServer();
}

module.exports = {
    app, runServer, closeServer
};
