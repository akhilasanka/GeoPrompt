var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema
const UserSchema = new Schema({
email: {
  type: String,
  required: true
},
password: {
  type: String,
  required: true
},
firstname: {
  type: String,
  
},
lastname:{
   type: String,  
}
});
    
var users=mongoose.model('Users',UserSchema)
module.exports = {users,UserSchema};
