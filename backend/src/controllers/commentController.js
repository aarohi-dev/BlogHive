import * as Comment from "../models/Comment.js";

//List all comments for a post
export const listForPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await Comment.listForPost(postId);
    return res.json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

//Create a new comment (protected)
export const create = async (req, res) => {
  try {
    const { content } = req.body;
    const post_id = req.params.postId;
    const author_id = req.session.user.id;

    const newComment = await Comment.addComment({
      post_id,
      author_id,
      content,
    });

    return res.status(201).json(newComment);
  } catch (err) {
    console.error("Error creating comment:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

//Remove a comment (protected + only by author)
export const remove = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const author_id = req.session.user.id;

    const deleted = await Comment.deleteComment({
      id: commentId,
      author_id,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ error: "Comment not found or unauthorized" });
    }

    return res.json({ deleted: true });
  } catch (err) {
    console.error("Error deleting comment:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
