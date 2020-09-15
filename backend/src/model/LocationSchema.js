var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;

const LocationSchema = new Schema({
categoryName: {
  type: String,
  required: true
},
address: {
  type: String,
  required: true
},
zipcode: {
  type: String,
  validate: {
    validator: function(v) {
      return /^[0-9]{5}(?:-[0-9]{4})?$/.test(v);
    },
    message: props => `${props.value} is not a valid zipcode number!`
  }
},
city:{
  type: String,
},
state:{
   type: String,
},
country:{
    type: String,
},
latitude:{
     type: SchemaTypes.Double
},
longitude:{
    type: SchemaTypes.Double
}
});
  
var locations = mongoose.model('Location',LocationSchema)
module.exports = {locations,LocationSchema};
