const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  authorId: String,
  authorName: String,
  title: String,
  content: String,
});

const ModelClass = mongoose.model('post', postSchema);

module.exports = ModelClass;
