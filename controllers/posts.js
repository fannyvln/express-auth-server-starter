const Post = require('../models/post');

/**
 * GET /api/posts
 * Fetch all posts.
 */
exports.fetchPosts = (req, res, next) => {
  Post
    .find({})
    .limit(100)
    .sort({ createdAt: -1 })
    .exec((err, posts) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Could not fetch posts' });
      }
      res.json(posts);
    });
};

/**
 * GET /api/posts/:postId
 * Fetch post by id.
 */
exports.fetchPost = (req, res, next) => {
  Post.findById({ '_id': req.params.postId }, (err, post) => {
    if (err) next(err);
    if (!post) {
      return res.status(404).json({ error: 'No post with that id exists' });
    }

    res.json(post);
  });
};

/**
 * POST /api/posts/edit/:postId
 * Edit post by id.
 */
exports.editPost = (req, res, next) => {
  Post.findById({ '_id': req.params.postId }, (err, post) => {
    if (err) next(err);
    if (!post) {
      return res.status(404).json({ error: 'No post with that id exists' });
    }

    if (post.authorId !== req.user._id.toString()) {
      return res.status(403).json({ error: 'User does not have permission to delete post' });
    }

    const title = req.body.title;
    const content = req.body.content;

    if (!title || title.trim() === '' || !content || content.trim() === '') {
      return res.status(400).json({
        error: 'Title or content can\'t be empty',
      });
    }

    post.title = title;
    post.content = content;

    post.save(err => {
      if (err) next(err);
      res.json(post);
    });
  });
};

/**
 * DELETE /api/posts/delete/:postId/
 * Delete post by id.
 */
exports.deletePost = (req, res, next) => {
  Post.findById({ '_id': req.params.postId }, (err, post) => {
    if (err) next(err);
    if (!post) {
      return res.status(404).json({ error: 'No post with that id exists' });
    }

    if (post.authorId !== req.user._id.toString()) {
      return res.status(403).json({ error: 'User does not have permission to delete post' });
    }

    Post.findByIdAndRemove({ '_id': req.params.postId }, (err, post) => {
      if (err) next(err);
      if (!post) {
        return res.status(404).json({ error: 'No post with that id exists' });
      }
      res.json({
        success: 'Post was deleted',
      });
    });
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
      error: 'Title or content can\'t be empty',
    });
  }

  const post = new Post({
    title: title.trim(),
    content: content.trim(),
    authorId: req.user._id,
    authorName: req.user.name,
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
