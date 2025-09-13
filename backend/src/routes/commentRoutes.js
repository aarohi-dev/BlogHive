import express from "express";
import * as commentController from "../controllers/commentController.js";
import {
  ensureAuthenticated,
  ensureCommentAuthor,
} from "../middleware/authMiddleware.js";
import { validateComment, handleValidationResult } from "../middleware/validationMiddleware.js";

const router = express.Router();

//list comments for a post
router.get("/posts/:postId/comments", commentController.listForPost);


// Add a comment
router.post(
  "/posts/:id/comments",
  ensureAuthenticated,
  validateComment,
  handleValidationResult,
  async (req, res) => {
    const newComment = await Comment.addComment({
      post_id: req.params.id,
      author_id: req.session.user.id,
      content: req.body.content,
    });
    res.status(201).json(newComment);
  }
);

router.delete(
  "/comments/:commentId",
  ensureAuthenticated,
  ensureCommentAuthor,
  commentController.remove
);

export default router;