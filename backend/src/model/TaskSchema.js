var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const TaskSchema = new Schema({
userid: {
  type: String,
  required: true
},
status: {
  type: String,
  required: true
},
categoryName: {
  type: String,
  required: true
},
title:{
    type: String,
    required: true
},
description:{
    type: String
},
priority:{
    type: Number
},
remindbefore:{
    type: Date,
    required: true
}
});
    
var tasks=mongoose.model('Tasks',TaskSchema)
module.exports = {tasks,TaskSchema};
