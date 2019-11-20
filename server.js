let express = require('express');
let morgan = require('morgan');
let bp = require('body-parser');
let bcrypt = require('bcryptjs');
let jsonParser = bp.json();

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let {PoolList, MatchdayList, TeamList, UserList, VoteList, ParticipantsList, InvitesList, MatchList} = require('./model');
let {DATABASE_URL, PORT} = require('./config');

let app = express();

app.use(express.static('public'));
app.use(morgan('dev'));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// GET Methods ----------------------------------------------------------------------------------------------------

app.get("/api/getPools", jsonParser, ( req, res, next ) => {
    PoolList.get()
        .then( pools => {
            return res.status( 200 ).json( pools );
        })
        .catch( error => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status( 500 ).json({
                status : 500,
                message : res.statusMessage
            })
        });
});

app.get("/api/getUserPools/:id", jsonParser, ( req, res, next ) => {
    PoolList.getUserPools(req.params.id)
        .then( pools => {
            return res.status( 200 ).json( pools );
        })
        .catch( error => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status( 500 ).json({
                status : 500,
                message : res.statusMessage
            })
        });
});

app.get("/api/getPools/:id", jsonParser, ( req, res, next ) => {
    PoolList.get(req.params.id)
        .then( pool => {
            MatchdayList.get(pool._id)
                .then(matchdays => {
                    console.log(matchdays);
                })
                .catch(error =>{
                    res.statusMessage = "Something went wrong with the DB. Try again later.";
                    return res.status( 500 ).json({
                        status : 500,
                        message : res.statusMessage
                    })
                });
            return res.status( 200 ).json( pool );
        })
        .catch( error => {
            
        });
});

app.get("/api/getUser/:id", jsonParser, (req, res, next) => {
    UserList.getById(req.params.id)
        .then( user => {
            return res.status ( 200 ).json( user );
        })
        .catch( error => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status( 500 ).json({
                status : 500,
                message : "Something went wrong with the DB. Try again later."
            })
        });
})

app.get("/api/Users", jsonParser, (req, res, next) => {
    UserList.get()
        .then(users => {
            return res.status(201).json(users);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB";
            return res.status(500).json({
                message: "Something went wrong with the DB",
                status: 500
            })

        })
});

app.get("/api/getMatches", jsonParser, (req, res, next) => {
    MatchdayList.get(req.query.poolID)
        .then( matchday => {
            MatchList.get(matchday._id)
                .then( matches => {
                    return res.status ( 200 ).json( matches );
                })
                .catch( error => {
                    res.statusMessage = "Something went wrong with the DB. Try again later.";
                    return res.status( 500 ).json({
                        status : 500,
                        message : res.statusMessage
                    });
                });
        })
        .catch( error => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status( 500 ).json({
                status : 500,
                message : res.statusMessage
            });
        });
});

// POST Methods ----------------------------------------------------------------------------------------------------

app.post("/api/registerUser", jsonParser, ( req, res, next ) => {
    let {name, lastname, username, dob, email, password} = req.body;

    if (!name || !lastname || !username || !email || !password) {
        res.statusMessage = "Missing field in the body";
        return res.status(406).json( {
            message: res.statusMessage,
            status: 406
        })
    }

    let newUser = {
        name, 
        lastname, 
        username, 
        dob,
        email, 
        password
    };

    UserList.getEmail(email)
        .then(userEmail => {
            if (!userEmail) {
                UserList.get(username)
                    .then(user => {
                        if (!user) {
                            return bcrypt.hash(password, 10);
                        }
                        else {
                            return res.status(409).json({
                                message: "Username is already taken",
                                status: 409
                            })
                        }
                    })
                    .then(hashPass => {
                        newUser.password = hashPass;
                        UserList.register(newUser)
                            .then(user => {
                                return res.status(201).json(user);
                            })
                            .catch(err => {
                                res.statusMessage = "Something went wrong with the DB";
                                return res.status(500).json({
                                    message: "Something went wrong with the DB",
                                    status: 500
                                })
                            });
                    })
                    .catch(err => {
                        res.statusMessage = "Something went wrong with the DB";
                        return res.status(500).json({
                            message: "Something went wrong with the DB",
                            status: 500
                        })
                    })
            }
            else {
                return res.status(409).json({
                    message: "Email is already taken",
                    status: 409
                })
            }
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB";
            return res.status(500).json({
                message: "Something went wrong with the DB",
                status: 500
            })
        })
});

app.post("/api/login", jsonParser, (req, res, next) => {
    let {username, password} = req.body;

    let user = {username, password};
	UserList.login(user)
		.then(goodUser => {
			return res.status( 202 ).json( goodUser );
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			})
		});
});

app.post("/api/postPool", jsonParser, (req, res, next) => {
    let newPool = {
        name: req.body.name,
        desc: req.body.desc,
        cost: req.body.cost,
        private: req.body.private,
        owner: req.body.owner
    };

    PoolList.post(newPool)
        .then(createdPool => {
            let matches = req.body.matchday;
            for (let i = 0; i < matches.length; i++) {
                let newTeamOne = {
                    name: matches[i].teamOne,
                    pool: createdPool._id
                }
                TeamList.post(newTeamOne)
                    .then(teamOne => {
                        let newTeamTwo = {
                            name: matches[i].teamTwo,
                            pool: createdPool._id
                        }
                        TeamList.post(newTeamTwo)
                            .then(teamTwo => {
                                let newMatch = {
                                    startDate: matches[i].startDate,
                                    finishDate: matches[i].finishDate,
                                    teamOne: teamOne._id,
                                    teamTwoo: teamTwo._id,
                                    pool: createdPool._id
                                }
                                MatchdayList.post(newMatch)
                                    .then(newMatch => {})
                                    .catch(err => {
                                        res.statusMessage = "Something went wrong with the DB. Try again later.";
                                        return res.status( 500 ).json({
                                            status : 500,
                                            message : "Something went wrong with the DB. Try again later."
                                        })
                                    })
                            })
                            .catch(err => {
                                res.statusMessage = "Something went wrong with the DB. Try again later.";
                                return res.status( 500 ).json({
                                    status : 500,
                                    message : "Something went wrong with the DB. Try again later."
                                })
                            })
                    })
                    .catch(err => {
                        res.statusMessage = "Something went wrong with the DB. Try again later.";
                        return res.status( 500 ).json({
                            status : 500,
                            message : "Something went wrong with the DB. Try again later."
                        })
                    })
            }
            return res.status( 202 ).json( createdPool );
        })
        .catch( error => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status( 500 ).json({
                status : 500,
                message : "Something went wrong with the DB. Try again later."
            })
        });
});

// PUT Methods ----------------------------------------------------------------------------------------------------

// DELETE Methods ----------------------------------------------------------------------------------------------------

// Examples of bcrypt ---------------------------------------------------------------------------------------------------

// app.post("/user/login", jsonParser, ( req, res, next ) => {
//     let {username, password} = req.body;

//     UserList.get({username})
//         .then( user => {
//             if (user) {
//                 return bcrypt.hash(password, 10);
//             }
//         })
//         .then( isValid => {
//             if (isValid) {
//                 // success
//             }
//         })


// });

// app.post("/user/register", jsonParser, ( req, res, next ) => {

//     let {username, password} = req.body;

//     UserList.get(username)
//         .then(user => {
//             if (!user) {
//                 return bcrypt.hash(password, 10);
//             }
//         })
//         .then(hashPass => {
//             UserList.register({username, password: hashPass});
//         })
// });

// app.post("/user/register", jsonParser, (req, res, next) => {
//     let { username, password } = req.body;
//     students.get({ username })
//         .then(user => {
//             if (!user) {
//                 return bcrypt.hash(password, 10);
//             }
//         })
//         .then(hashPass => users.register({ username, password: hashPass }))
//     });

// app.post("/user/login", jsonParser, (req, res, next) => {
//     let { username, password } = req.body;
//     user.get({ username })
//         .then(user => {
//             if (user) {
//                 return bcrypt.compare(password, user.password)
//             }
//         })
//         .then(isValid => {
//             if (isValid) {
//                 //success
//             }
// 	    })
// });

// Example of methods ------------------------------------------------------------------------

// app.get( "/api/pets", ( req, res, next ) => {
// 	PetList.get(req.query.id)
// 		.then( pets => {
// 			return res.status( 200 ).json( pets );
// 		})
// 		.catch( error => {
// 			res.statusMessage = "Something went wrong with the DB. Try again later.";
// 			return res.status( 500 ).json({
// 				status : 500,
// 				message : "Something went wrong with the DB. Try again later."
// 			})
// 		});
// });

// app.post("/api/postPet", jsonParser, (req, res, next) => {
//     let {name, typeOfPet, id} = req.body;

//     if (!name || !typeOfPet || !id) {
//         res.statusMessage = "Missing field in the body";
//         return res.status(406).json( {
//             message: "Missing field in the body",
//             status: 406
//         })
//     }

//     // We still need to validate that the ID doesn't exist
//     PetList.get(id)
//         .then( pets => {
//             if (pets != null) {
//                 res.statusMessage = "ID is used";
//                 return res.status(409).json( {
//                     message: res.statusMessage,
//                     status: 409
//                 })
//             } else {
//                 let newPet = {
//                     name,
//                     typeOfPet,
//                     id
//                 };
            
//                 PetList.post(newPet)
//                     .then(pet => {
//                         return res.status(201).json(pet);
//                     })
//                     .catch(err => {
//                         res.statusMessage = "Something went wrong with the DB";
//                         return res.status(500).json({
//                             message: "Something went wrong with the DB",
//                             status: 500
//                         })
//                     })
//             }
//         })
//         .catch( error => {
//             res.statusMessage = "Something went wrong with the DB. Try again later.";
//             return res.status( 500 ).json({
//                 status : 500,
//                 message : "Something went wrong with the DB. Try again later."
//             })
//         });
// });

// server.js de Benja

let server;

function runServer(port, databaseUrl) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, response => {
            if (response) {
                return reject(response);
            }
            else {
                server = app.listen(port, () => {
                    console.log("App is running on port " + port);
                    resolve();
                })
                    .on('error', err => {
                        mongoose.disconnect();
                        return reject(err);
                    })
            }
        });
    });
}

function closeServer() {
    return mongoose.disconnect()
        .then(() => {
            return new Promise((resolve, reject) => {
                console.log('Closing the server');
                server.close(err => {
                    if (err) {
                        return reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
}

runServer(PORT, DATABASE_URL)
    .catch(err => {
        console.log(err);
    });

module.exports = { app, runServer, closeServer };
