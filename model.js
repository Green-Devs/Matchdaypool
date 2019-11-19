let mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// User model ---------------------------------------------------------------------------------------------------------------------

let userSchema = mongoose.Schema({
    name: {type: String, require: true},
    lastname: {type: String, require: true},
    username: {type: String, require: true},
    dob: { type: String, require: true },
    email: {type: String, require: true},
    password: {type: String, require: true}
});

let User = mongoose.model('User', userSchema);

let UserList = {
    get: function(user){
        if (user) {
            return User.find({username: user.username})
                .then( users => {
                    return users;
                })
                .catch( error => {
                    throw Error( error );
                });
        } else {
            return User.find()
                .then( users => {
                    return users;
                })
                .catch( error => {
                    throw Error( error );
                });
        }
        
    },
    post: function(newUser) {
        return User.create(newUser)
            .then(user => {
                return user;
            })
            .catch(err => {
                throw Error(err);
            });
    },
};

// Pool model ---------------------------------------------------------------------------------------------------------------------

let poolSchema = mongoose.Schema ({
    name: {type: String, require: true},
    desc: {type: String, require: true},
    cost: {type: Number, require: true},
    private: {type: Boolean, require: true},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
});

let Pool = mongoose.model('Pool', poolSchema);

let PoolList = {
    get: function(){
        return Pool.find()
        .then( pools => {
            return pools;
        })
        .catch( error => {
            throw Error( error );
        });
    },
    post: function(newPool) {
        return Pool.create(newPool)
            .then(pool => {
                return pool;
            })
            .catch(err => {
                throw Error(err);
            });
    },
    update: function(pool) {
        return Pool.findOneAndUpdate({id:id}, {$set:{pool}},{new:time})
            .then(pool => {
                return pool;
            })
            .catch(err => {
                throw Error(err);
            });
    },
    delete: function(poolID) {
        return Pool.findByIdAndDelete({id:poolID})
            .then(pool => {
                return pool;
            })
            .catch(err => {
                throw Error(err);
            });
    }
};

// Teams model ---------------------------------------------------------------------------------------------------------------------

let teamSchema = mongoose.Schema({
    name: {type: String, require: true},
    pool: {type: mongoose.Schema.Types.ObjectId, ref: "Pool"}
});

let Team = mongoose.model('Team', teamSchema);

let TeamList = {};

// Matchday model ---------------------------------------------------------------------------------------------------------------------

let matchdaySchema = mongoose.Schema ({
    startDate: {type: Date, require: true},
    finishDate: {type: Date, require: true},
    teamOne:{type: mongoose.Schema.Types.ObjectId, ref: "Team"},
    teamTwo: {type: mongoose.Schema.Types.ObjectId, ref: "Team"},
    pool: {type: mongoose.Schema.Types.ObjectId, ref: "Pool"}
});

let Matchday = mongoose.model('Matchday', matchdaySchema);

let MatchdayList = {};

// Participants model ---------------------------------------------------------------------------------------------------------------------

let participantsSchema = mongoose.Schema({
    participant: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    pool: {type: mongoose.Schema.Types.ObjectId, ref: "Pool"},
});

let Participants = mongoose.model('Participants', participantsSchema);

let ParticipantsList = {};

// Invites model ---------------------------------------------------------------------------------------------------------------------

let invitesSchema = mongoose.Schema({
    invitee: {type: mongoose.Schema.Types.ObjectId, ref: "User", require: true},
    pool: {type: mongoose.Schema.Types.ObjectId, ref: "Pool", require: true},
    status: {type: "String", require: true}
});

let Invites = mongoose.model('Invites', participantsSchema);

let InvitesList = {};

// Votes model ---------------------------------------------------------------------------------------------------------------------

let voteSchema = mongoose.Schema({
    participant: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    matchdays: {type: mongoose.Schema.Types.ObjectId, ref: "Matchday"},
    winner:{type: mongoose.Schema.Types.ObjectId, ref: "Team"},
});

let Vote = mongoose.model('Vote', voteSchema);

let VoteList = {};

// Example of models ---------------------------------------------------------------------------------------------------------------------

// let ownerSchema = mongoose.Schema ({
//     id: {type: Number, require: true}
// });

// let Owner = mongoose.model('Owner', ownerSchema);

// let petSchema = mongoose.Schema({
//     name: {type: String},
//     typeOfPet: {type: String},
//     id: {
//         type: Number, 
//         required: true
//     },
//     owner: {type: mongoose.Schema.Types.ObjectId, ref: "Owner"}
// });

// let Pet = mongoose.model('Pet', petSchema);

// let PetList = {
//     get : function(idParam){
//         if (idParam != null) {
//             return Pet.findOne({id:idParam})
// 				.then( pets => {
// 					return pets;
// 				})
// 				.catch( error => {
// 					throw Error( error );
// 				});
//         } else {
//             return Pet.find()
// 				.then( pets => {
// 					return pets;
// 				})
// 				.catch( error => {
// 					throw Error( error );
// 				});
//         }
		
// 	},
//     post: function(newPet) {
//         return Pet.create(newPet)
//             .then(pet => {
//                 return pet;
//             })
//             .catch(err => {
//                 throw Error(err);
//             });
//     }
// }

module.exports = {PoolList, MatchdayList, TeamList, UserList, VoteList, ParticipantsList, InvitesList};