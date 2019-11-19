let express = require('express');
let morgan = require('morgan');
let bp = require('body-parser');
let jsonParser = bp.json();
let bcrypt = require('bcryptjs');

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let {PoolList, MatchdayList, TeamList, UserList, VoteList, ParticipantsList, InvitesList} = require('./model');
let {DATABASE_URL, PORT} = require('./config');

let app = express();

app.use(express.static('public'));
app.use(morgan('dev'));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get("/api/pools", ( req, res, next ) => {
    PoolList.get()
        .then( pools => {
            return res.status( 200 ).json( pools );
        })
        .catch( error => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status( 500 ).json({
                status : 500,
                message : "Something went wrong with the DB. Try again later."
            })
        });
});

app.post("/api/postUser", jsonParser, ( req, res, next ) => {
    let {name, lastname, username, email, password} = req.body;

    if (!name || !lastname || !username || !email || !password) {
        res.statusMessage = "Missing field in the body";
        return res.status(406).json( {
            message: "Missing field in the body",
            status: 406
        })
    }

    let newUser = {
        name, 
        lastname, 
        username, 
        email, 
        password
    };

    UserList.post(newUser)
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
