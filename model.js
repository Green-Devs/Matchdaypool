let mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// User model ---------------------------------------------------------------------------------------------------------------------

let userSchema = mongoose.Schema({
    name: { type: String, require: true },
    lastname: { type: String, require: true },
    username: { type: String, require: true },
    dob: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true }

});

let User = mongoose.model('User', userSchema);

let UserList = {
    get: function (userNameToFind) {
        if (userNameToFind) {
            return User.findOne({ username: userNameToFind })
                .then(user => {
                    return user;
                })
                .catch(error => {
                    throw Error(error);
                });
        } else {
            return User.find()
                .then(users => {
                    return users;
                })
                .catch(error => {
                    throw Error(error);
                });
        }

    },
    getEmail: function (emailToFind) {
        return User.findOne({ email: emailToFind })
            .then(user => {
                return user;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    getById: function(userID) {
        return User.findById(userID)
            .then( users => {
                return users;
            })
            .catch( error => {
                throw Error( error );
            });
    },
    register: function(newUser) {
        return User.create(newUser)
            .then(user => {
                return user;
            })
            .catch(err => {
                throw Error(err);
            });
    },
    update: function (updatedUser) {
        return User.updateOne({_id: updatedUser.id}, updatedUser)
            .then(user => {
                return user;
            })
            .catch(err => {
                throw Error(err);
            });
    }
};

// Pool model ---------------------------------------------------------------------------------------------------------------------

let poolSchema = mongoose.Schema ({
    name: {type: String, require: true},
    desc: {type: String, require: true},
    cost: {type: Number, require: true},
    sport: {type: String,},
    private: {type: Boolean, require: true},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: "User", require: true}
});

let Pool = mongoose.model('Pool', poolSchema);

let PoolList = {
    get: function(poolID){
        if (poolID) {
            return Pool.find({_id: poolID, private: false})
                .then( pools => {
                    return pools;
                })
                .catch( error => {
                    throw Error( error );
                });
        } else {
            return Pool.find({private: false})
                .then( pools => {
                    return pools;
                })
                .catch( error => {
                    throw Error( error );
                });
        }
        
    },
    getUserPools: function(ownerID){
        return Pool.find({owner: ownerID})
            .then( pools => {
                return pools;
            })
            .catch( error => {
                throw Error( error );
            });
        
    },
    post: function (newPool) {
        return Pool.create(newPool)
            .then(pool => {
                return pool;
            })
            .catch(err => {
                throw Error(err);
            });
    },
    update: function(pool) {
        return Pool.findOneAndUpdate({ id:pool.id }, { $set:{pool} })
            .then(pool => {
                return pool;
            })
            .catch(err => {
                throw Error(err);
            });
    },
    delete: function (poolID) {
        return Pool.findByIdAndDelete({ id: poolID })
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
    pool: {type: mongoose.Schema.Types.ObjectId, ref: "Pool", require: true}
});

let Team = mongoose.model('Team', teamSchema);

let TeamList = {
    get: function (teamID) {
        return Team.find({_id: teamID})
            .then(teams => {
                return teams;
            })
            .catch(err => {
                throw Error(err);
            });
    },
    getByPool: function(poolID) {
        return Team.find({pool: poolID})
            .then(teams => {
                return teams;
            })
            .catch(err => {
                throw Error(err);
            });
    },
    post: function(newTeam) {
        return Team.create(newTeam)
            .then(team => {
                return team;
            })
            .catch(err => {
                throw Error(err);
            });
    },
    delete: function(poolID) {
        return Team.deleteMany({pool: poolID})
            .then(teams => {
                return teams;
            })
            .catch(err => {
                throw Error(err);
            });
    }
};

// Matchday model ---------------------------------------------------------------------------------------------------------------------

let matchdaySchema = mongoose.Schema ({
    startDate: {type: Date, require: true},
    finishDate: {type: Date, require: true},
    pool: {type: mongoose.Schema.Types.ObjectId, ref: "Pool", require: true}
});

let Matchday = mongoose.model('Matchday', matchdaySchema);

let MatchdayList = {
    get: function() {
        return Matchday.find()
            .then(matchdays => {
                return matchdays;
            })
            .catch(err => {
                throw Error(err);
            });
    },
    getByPool: function(poolID) {
        return Matchday.find({pool: poolID})
            .then(matchdays => {
                return matchdays;
            })
            .catch(err => {
                throw Error(err);
            });
    },
    post: function(newMatchday) {
        return Matchday.create(newMatchday)
            .then(matchday => {
                return matchday;
            })
            .catch(err => {
                throw Error(err);
            });
    },
    put: function(updatedMatchday) {
        return Matchday.updateOne({_id: updatedMatchday.id}, updatedMatchday)
            .then(matchday => {
                return matchday;
            })
            .catch(err => {
                throw Error(err);
            });
    },
    delete: function (matchdayID) {
        return Matchday.findByIdAndDelete(matchdayID)
            .then(matchday => {
                return matchday;
            })
            .catch(err => {
                throw Error(err);
            });
    },
    deleteMany: function(poolID) {
        return Matchday.deleteMany({pool: poolID})
            .then(matchdays => {
                return matchdays;
            })
            .catch(err => {
                throw Error(err);
            });
    }
};

// Match model ---------------------------------------------------------------------------------------------------------------------

let matchSchema = mongoose.Schema ({
    teamOne:{type: mongoose.Schema.Types.ObjectId, ref: "Team", require: true},
    teamTwo: {type: mongoose.Schema.Types.ObjectId, ref: "Team", require: true},
    matchday: {type: mongoose.Schema.Types.ObjectId, ref: "Matchday", require: true},
    pool: {type: mongoose.Schema.Types.ObjectId, ref: "Pool", require: true},
    winner: {type: mongoose.Schema.Types.ObjectId, ref: "Team"},
    draw: {type: Boolean}
});

let Match = mongoose.model('Match', matchSchema);

let MatchList = {
    get: function(matchdayID) {
        return Match.find({matchday: matchdayID})
            .then(matches => {
                return matches;
            })
            .catch(err => {
                throw Error(err);
            });
    },
    getByPool: function (poolID) {
        return Match.find({pool: poolID})
            .then(matches => {
                return matches;
            })
            .catch(err => {
                throw Error(err);
            });
    },
    post: function(newMatch) {
        return Match.create(newMatch)
            .then(match => {
                return match;
            })
            .catch(err => {
                throw Error(err);
            });
    },
    put: function(match) {
        return Match.updateOne({_id: match.id}, match)
            .then(match => {
                return match;
            })
            .catch(err => {
                throw Error(err);
            });
    },
    delete: function(matchdayID) {
        return Match.deleteMany({matchday: matchdayID})
            .then(matches => {
                return matches;
            })
            .catch(err => {
                throw Error(err);
            });
    }
};

// Participants model ---------------------------------------------------------------------------------------------------------------------

let participantsSchema = mongoose.Schema({
    participant: {type: mongoose.Schema.Types.ObjectId, ref: "User", require: true},
    pool: {type: mongoose.Schema.Types.ObjectId, ref: "Pool", require: true},
    coveredCost: {type: Boolean, require: true}
});

let Participants = mongoose.model('Participants', participantsSchema);

let ParticipantsList = {
    get: function(poolID) {
        return Participants.find({pool: poolID})
            .then(participants => {
                return participants;
            })
            .catch(err => {
                throw Error(err);
            });
    },
    getByUser: function (userID) {
        return Participants.find({participant: userID})
            .then(participants => {
                return participants;
            })
            .catch(err => {
                throw Error(err);
            });
    },
    post: function (newParticipation) {
        return Participants.create(newParticipation)
            .then(participation => {
                return participation;
            })
            .catch(err => {
                throw Error(err);
            });
    },
    put: function (participation) {
        return Participants.updateOne({_id: participation.id}, participation)
            .then(participation => {
                return participation;
            })
            .catch(err => {
                throw Error(err);
            });
    },
    delete: function (participationID) {
        return Participants.deleteOne({_id: participationID})
            .then(participants => {
                return participants;
            })
            .catch(err => {
                throw Error(err);
            });
    }
};

// Invites model ---------------------------------------------------------------------------------------------------------------------

let invitesSchema = mongoose.Schema({
    invitee: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
    pool: { type: mongoose.Schema.Types.ObjectId, ref: "Pool", require: true },
    status: { type: "String", require: true }
});

let Invites = mongoose.model('Invites', invitesSchema);

let InvitesList = {
    get: function(inviteeID) {
        return Invites.find({invitee: inviteeID})
            .then(invites => {
                return invites;
            })
            .catch(err => {
                throw Error(err);
            });
    },
    post : function(newInvite) {
        return Invites.create(newInvite)
            .then(invite => {
                return invite;
            })
            .catch(err => {
                throw Error(err);
            });
    },
    put : function(updatedInvite) {
        return Invites.updateOne({_id: updatedInvite.id}, updatedInvite)
            .then(invite => {
                return invite;
            })
            .catch(err => {
                throw Error(err);
            });
    }
};

// Votes model ---------------------------------------------------------------------------------------------------------------------

let voteSchema = mongoose.Schema({
    participant: {type: mongoose.Schema.Types.ObjectId, ref: "User", require: true},
    match: {type: mongoose.Schema.Types.ObjectId, ref: "Match", require: true},
    winner: {type: mongoose.Schema.Types.ObjectId, ref: "Team"},
    draw: {type: Boolean}
});

let Vote = mongoose.model('Vote', voteSchema);

let VoteList = {
    get: function (matchID) {
        return Vote.find({match: matchID})
            .then(vote => {
                return vote;
            })
            .catch(err => {
                throw Error(err);
            });
    },
    post: function (newVote) {
        return Vote.create(newVote)
            .then(vote => {
                return vote;
            })
            .catch(err => {
                throw Error(err);
            });
    },
    put: function (updatedVote) {
        return Vote.create({_id: updatedVote.id}, updatedVote)
            .then(vote => {
                return vote;
            })
            .catch(err => {
                throw Error(err);
            });
    }
};

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

module.exports = {PoolList, MatchdayList, TeamList, UserList, VoteList, ParticipantsList, InvitesList, MatchList};
