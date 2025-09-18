import express from "express";
import { ensureAuthenticated } from "../middleware/authMiddleware.js";
import { validatePost, handleValidationResult } from "../middleware/validators.js";
import * as Post from "../models/Post.js";

const router = express.Router();

// Create post
router.post(
  "/posts",
  ensureAuthenticated,
  validatePost,
  handleValidationResult,
  async (req, res) => {
    try {
      const newPost = await Post.createPost({
        title: req.body.title,
        content: req.body.content,
        author_id: req.session.user.id,
      });
      res.status(201).json(newPost);
    } catch (err) {
      console.error("Error creating post:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.put(
  "/posts/:id",
  ensureAuthenticated,
  ensurePostAuthor,
  validatePost,
  handleValidationResult,
  postController.update
);

router.delete(
  "/posts/:id",
  ensureAuthenticated,
  ensurePostAuthor,
  postController.remove
);

// 📌 Likes
router.post(
  "/posts/:postId/like",
  ensureAuthenticated,
  postController.toggleLike
);

router.get(
  "/posts/:postId/likes",
  // ensureAuthenticated (optional)
  postController.getLikes
);

export default router;
