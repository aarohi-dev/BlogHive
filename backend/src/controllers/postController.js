import * as Post from "../models/Post.js";
import * as Comment from "../models/Comment.js";

//List all posts with pagination
export const list = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const posts = await Post.listPosts({ limit, offset });
    return res.json(posts);
  } catch (err) {
    console.error("Error listing posts:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

//Get one post + its comments
export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.getPostById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comments = await Comment.listForPost(postId);
    return res.json({ ...post, comments });
  } catch (err) {
    console.error("Error fetching post:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

//Create post (protected)
export const create = async (req, res) => {
  try {
    const { title, content } = req.body;
    const author_id = req.session.user.id;

    const newPost = await Post.createPost({ title, content, author_id });
    return res.status(201).json(newPost);
  } catch (err) {
    console.error("Error creating post:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

//Update post (protected + author)
export const update = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { id } = req.params;
    const author_id = req.session.user.id;

    const updatedPost = await Post.updatePost({ id, author_id, title, content });

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found or unauthorized" });
    }

    return res.json(updatedPost);
  } catch (err) {
    console.error("Error updating post:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

//Delete post (protected + author)
export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const author_id = req.session.user.id;

    const deleted = await Post.deletePost({ id, author_id });
    if (!deleted) {
      return res.status(404).json({ error: "Post not found or unauthorized" });
    }

    return res.json({ deleted: true });
  } catch (err) {
    console.error("Error deleting post:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

//Toggle like (protected)
export const toggleLike = async (req, res) => {
  try {
    const { id: post_id } = req.params;
    const user_id = req.session.user.id;

    const alreadyLiked = await Post.userLikesPost({ post_id, user_id });

    if (alreadyLiked) {
      await Post.unlikePost({ post_id, user_id });
    } else {
      await Post.likePost({ post_id, user_id });
    }

    const count = await Post.getLikeCount(post_id);
    return res.json({ liked: !alreadyLiked, count });
  } catch (err) {
    console.error("Error toggling like:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

//Get like count + whether current user liked
export const getLikes = async (req, res) => {
  try {
    const { id: post_id } = req.params;
    const user_id = req.session.user?.id;

    const count = await Post.getLikeCount(post_id);
    const likedByMe = user_id
      ? await Post.userLikesPost({ post_id, user_id })
      : false;

    return res.json({ count, likedByMe });
  } catch (err) {
    console.error("Error fetching likes:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
