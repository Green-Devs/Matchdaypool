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
            for (let i = 0; i < pools.length; i++) {
                UserList.getById(pools[i].owner)
                    .then( User => { 
                        console.log(User);
                        console.log(pools);
                        pools[i].ownerName = User.name;
                        return;
                    })
                    .catch( error => {
                        res.statusMessage = "Something went wrong with the DB. Try again later.";
                        return res.status( 500 ).json({
                            status : 500,
                            message : res.statusMessage
                        })
                    });
            }
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
    let userPools = {
        ownedPools: [],
        participatingPools: []
    }

    PoolList.getUserPools(req.params.id)
        .then( ownedPools => {

            userPools.ownedPools = ownedPools;
            
            ParticipantsList.getByUser(req.params.id)
                .then( participatingPools => {

                    userPools.participatingPools = participatingPools;
                    return res.status( 200 ).json( userPools );
                })
                .catch( error => {
                    res.statusMessage = "Something went wrong with the DB. Try again later.";
                    return res.status( 500 ).json({
                        status : 500,
                        message : res.statusMessage
                    })
                });
        })
        .catch( error => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status( 500 ).json({
                status : 500,
                message : res.statusMessage
            })
        });
});

app.get("/api/getPoolInfo/:id", jsonParser, ( req, res, next ) => {
    let searchedPool = {
        pool: {},
        matchdays: [],
        matches: [],
        teams: []
    }
    PoolList.get(req.params.id)
        .then( pool => {
            searchedPool.pool = pool;
            MatchdayList.get(pool._id)
                .then(matchdays => {
                    searchedPool.matchdays = matchdays;
                })
                .catch(error =>{
                    res.statusMessage = "Something went wrong with the DB. Try again later.";
                    return res.status( 500 ).json({
                        status : 500,
                        message : res.statusMessage
                    })
                });
            MatchList.getByPool(pool._id)
                .then(matches => {
                    searchedPool.matches = matches;
                })
                .catch(error =>{
                    res.statusMessage = "Something went wrong with the DB. Try again later.";
                    return res.status( 500 ).json({
                        status : 500,
                        message : res.statusMessage
                    })
                });

            TeamList.getByPool(pool._id)
                .then(teams => {
                    searchedPool.teams = teams;
                })
                .catch(error =>{
                    res.statusMessage = "Something went wrong with the DB. Try again later.";
                    return res.status( 500 ).json({
                        status : 500,
                        message : res.statusMessage
                    })
                });
            return res.status( 200 ).json( searchedPool );
        })
        .catch( error => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
                return res.status( 500 ).json({
                    status : 500,
                    message : res.statusMessage
                })
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

app.get("/api/getInvites/:userID", jsonParser, (req, res, next) => {
    InvitesList.get(req.params.userID)
        .then( invites => {
            return res.status ( 200 ).json( invites );
                
        })
        .catch( error => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status( 500 ).json({
                status : 500,
                message : res.statusMessage
            });
        });
});

app.get("/api/getPoolTeams", jsonParser, (req, res, next) => {
    TeamList.getByPool(req.body.id)
        .then( teams => {
            return res.status ( 200 ).json( teams );
                
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

    if (!name || !lastname || !username || !dob ||!email || !password) {
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
    let { username, password } = req.body
    if (!username || !password) {
        res.statusMessage = 'Missing field in body'
        return res.status('406').json({
            message: 'Missing field in body',
            status: 406
        })
    }
    UserList.get(username)
        .then(user => {
            if (user) {
                return bcrypt.compare(password, user.password)
            } else {
                res.statusMessage = 'Username not found'
                return res.status(401).json({
                    message: 'Username not found',
                    status: 404
                })
            }
        })
        .then(match => {
            if (match) {
                return res.status(200).json(req.body.username)
            } else {
                res.statusMessage = `Passwords doesn't match`
                return res.status(404).json({
                    message: `Passwords doesn't match`,
                    status: 404
                })
            }
        })
        .catch(error => {
            res.statusMessage = 'Something went wrong with the db'
            return res.status(500).json({
                status: 500,
                message: 'Something went wrong with the db'
            })
        })

});

app.post("/api/createPool", jsonParser, (req, res, next) => {
    let newPool = {
        name: req.body.name,
        desc: req.body.desc,
        cost: req.body.cost,
        private: req.body.private,
        owner: req.body.owner,
        sport: req.body.sport
    };

    let returnObj = {
        pool: {},
        teams: []
    }

    PoolList.post(newPool)
        .then(createdPool => {
            returnObj.pool = createdPool;

            for (let i = 0; i < req.body.teams.length; i++) {
                let newTeam = {
                    name: req.body.teams[i].name,
                    pool: createdPool._id
                }
                TeamList.post(newTeam)
                    .then(createdTeam => {
                        returnObj.teams.push(createdTeam);
                        console.log("teams", returnObj.teams);
                    })
                    .catch( error => {
                        console.log(error);
                        res.statusMessage = "Something went wrong with the DB. Try again later.";
                        return res.status( 500 ).json({
                            status : 500,
                            message : res.statusMessage
                        })
                    });
            }

            return res.status( 202 ).json( returnObj );
        })
        .catch( error => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status( 500 ).json({
                status : 500,
                message : res.statusMessage
            })
        });
});

app.post("/api/createInvite", jsonParser, (req, res, next) => {
    let {invitee, pool, status} = req.body;

    InvitesList.post({invitee, pool, status})
        .then(invite => {
			return res.status( 202 ).json( invite );
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : res.statusMessage
			})
		});
});

app.post("/api/createMatchday", jsonParser, (req, res, next) => {
    
    let newMatchday = {
        startDate: req.body.startDate,
        finishDate: req.body.finishDate,
        pool: req.body.poolID
    }

    let matches = [];
    
    MatchdayList.post(newMatchday)
        .then(newMatchday => {
            for (let i = 0; i < req.body.matches.length; i++) {
                let newMatch = {
                    teamOne: req.body.matches.teamOne,
                    teamTwo: req.body.matches.teamTwo,
                    matchday: newMatchday._id,
                    pool: newMatchday.pool
                }
                MatchList.post(newMatch)
                    .then(createdMatch => {
                        matches.push(createdMatch);
                    })
                    .catch(err => {
                        res.statusMessage = "Something went wrong with the DB. Try again later.";
                        return res.status( 500 ).json({
                            status : 500,
                            message : res.statusMessage
                        })
                    })
            }
            return res.status( 202 ).json( {newMatchday, matches} );
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status( 500 ).json({
                status : 500,
                message : res.statusMessage
            })
        })
});

// PUT Methods ----------------------------------------------------------------------------------------------------

app.put("/api/updateInvite", jsonParser, (req, res, next) => {
    let {invitee, pool, status} = req.body;

    InvitesList.put({invitee, pool, status})
        .then(invite => {
            if (status = "Accepted") {
                ParticipantsList.post({participant: invitee, pool: pool, coveredCost: false})
                    .then(participation => {})
                    .catch( error => {
                        res.statusMessage = "Something went wrong with the DB. Try again later.";
                        return res.status( 500 ).json({
                            status : 500,
                            message : res.statusMessage
                        })
                    });
            }
			return res.status( 202 ).json( invite );
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : res.statusMessage
			})
		});
});

app.put("/api/updateUser", jsonParser, (req, res, next) => {
    let {name, lastname, username, dob, email, password, id} = req.body;

    UserList.update({name, lastname, username, dob, email, password, id})
        .then(user => {
            return res.status( 202 ).json( user );
        })
        .catch( error => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status( 500 ).json({
                status : 500,
                message : res.statusMessage
            })
        });
});

app.put("/api/updatePoolinfo", jsonParser, (req, res, next) => {
    let updatedPool = {
        name: req.body.name,
        desc: req.body.desc,
        cost: req.body.cost,
        private: req.body.private,
        owner: req.body.owner,
        sport: req.body.sport
    }

    PoolList.update(updatedPool)
        .then(updatedPool => {

            return res.status( 202 ).json( updatedPool );
        })
        .catch( error => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status( 500 ).json({
                status : 500,
                message : res.statusMessage
            })
        });
    
    
});

app.put("/api/updateMatchday", jsonParser, (req, res, next) => {
    let updatedMatchday = {
        startDate: req.body.startDate,
        finishDate: req.body.finishDate,
        pool: req.body.poolID
    }

    let matches = [];
    
    MatchdayList.put(updatedMatchday)
        .then(updateMatchday => {
            for (let i = 0; i < req.body.matches.length; i++) {
                let updatedMatch = {
                    teamOne: req.body.matches.teamOne,
                    teamTwo: req.body.matches.teamTwo,
                    matchday: updateMatchday._id,
                    pool: updateMatchday.pool
                }
                MatchList.post(updatedMatch)
                    .then(updateMatch => {
                        matches.push(updateMatch);
                    })
                    .catch(err => {
                        res.statusMessage = "Something went wrong with the DB. Try again later.";
                        return res.status( 500 ).json({
                            status : 500,
                            message : res.statusMessage
                        })
                    })
            }
            return res.status( 202 ).json( {updateMatchday, matches} );
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status( 500 ).json({
                status : 500,
                message : res.statusMessage
            })
        })
});

// DELETE Methods ----------------------------------------------------------------------------------------------------

app.delete("/api/deletePool", jsonParser, (req, res, next) => {
    let erasedPool = {
        pool: {},
        matchdays: {},
        matches: {},
        teams: {}
    };

    MatchdayList.get(req.body.id)
        .then(matchdays => {
            for (let i = 0; i < matchdays.length; i++) {
                MatchList.delete(matchdays[i]._id)
                    .then(matches => {
                        erasedPool.matches = matches;
                    })
                    .catch( error => {
                        res.statusMessage = "Something went wrong with the DB. Try again later.";
                        return res.status( 500 ).json({
                            status : 500,
                            message : res.statusMessage
                        })
                    });
            }
        })
        .catch( error => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status( 500 ).json({
                status : 500,
                message : res.statusMessage
            })
        });
    MatchdayList.deleteMany(req.body.id)
        .then(matchdays => {
            erasedPool.matchdays = matchdays;
        })
        .catch( error => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status( 500 ).json({
                status : 500,
                message : res.statusMessage
            })
        });
    TeamList.delete(req.body.id)
        .then(teams => {
            erasedPool.teams = teams;
        })
        .catch( error => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status( 500 ).json({
                status : 500,
                message : res.statusMessage
            })
        });
    PoolList.delete(req.body.id)
        .then(pool => {
            erasedPool.pool = pool;
            return res.status( 202 ).json( erasedPool );
        })
        .catch( error => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status( 500 ).json({
                status : 500,
                message : res.statusMessage
            })
        });
});

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
