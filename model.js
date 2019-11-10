let mongoose = require('mongoose');

// Example of models ------------------------------------------------------------------------

// mongoose.Promise = global.Promise;

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

// module.exports = {PetList};