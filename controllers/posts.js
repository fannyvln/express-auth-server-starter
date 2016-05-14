const Post = require('../models/post');

/**
 * GET /api/posts
 * Fetch all posts.
 */
exports.fetchPosts = (req, res, next) => {
  Post
    .find({})
    .limit(10)
    .exec((err, posts) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Could not fetch posts' });
      }
      res.json(posts);
    });
};

/**
 * POST /api/posts
 * Create a new post.
 */
exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;

  if (!title || title.trim() === '' || !content || content.trim() === '') {
    return res.status(400).json({
      error: 'Post title or content missing',
    });
  }

  const post = new Post({
    title: title.trim(),
    content: content.trim(),
    authorId: req.user._id,
  });

  post.save((err, post) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        error: 'Could not save post',
      });
    }

    res.json(post);
  });
};
