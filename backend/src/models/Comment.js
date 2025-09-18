import pool from "../config/db.js"; 

//List all comments for a post
export async function listForPost(post_id) {
  const result = await pool.query(
    `
    SELECT 
      c.*, 
      u.name AS author_name, 
      u.avatar AS author_avatar
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.post_id = $1
    ORDER BY c.created_at ASC
    `,
    [post_id]
  );
  return result.rows;
}

//Add a comment
export async function addComment({ post_id, author_id, content }) {
  const result = await pool.query(
    `
    INSERT INTO comments (post_id, user_id, content)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [post_id, author_id, content]
  );
  return result.rows[0];
}

//Delete a comment (only by its author)
export async function deleteComment({ id, author_id }) {
  const result = await pool.query(
    `
    DELETE FROM comments
    WHERE id = $1 AND user_id = $2
    RETURNING id
    `,
    [id, author_id]
  );
  return result.rows[0] || null;
}

//Count comments for a post
export async function countForPost(post_id) {
  const result = await pool.query(
    `
    SELECT COUNT(*)::int AS comment_count
    FROM comments
    WHERE post_id = $1
    `,
    [post_id]
  );
  return result.rows[0].comment_count;
}
