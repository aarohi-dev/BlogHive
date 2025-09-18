import * as Post from "../models/Post.js";
import pool from "../config/db.js"; 


//Ensure user is logged in
export function ensureAuthenticated(req, res, next) {
  if (req.session?.user) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized" });
}

//Ensure current user is the post author
export async function ensurePostAuthor(req, res, next) {
  const postId = req.params.id;

  try {
    const post = await Post.getPostById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.author_id !== req.session.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  } catch (err) {
    console.error("ensurePostAuthor error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

//Ensure current user is the comment author
export async function ensureCommentAuthor(req, res, next) {
  const commentId = req.params.id;

  try {
    const result = await pool.query(
      "SELECT user_id FROM comments WHERE id = $1",
      [commentId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const { user_id } = result.rows[0];

    if (user_id !== req.session.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  } catch (err) {
    console.error("ensureCommentAuthor error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
