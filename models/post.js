const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  authorId: String,
  authorName: String,
  title: String,
  content: String,
});

postSchema.plugin(timestamps);

const ModelClass = mongoose.model('post', postSchema);

module.exports = ModelClass;
