import pool from "../db.js";

//list posts with author info + like/comment counts
export async function listPosts({ limit = 10, offset = 0 }) {
  const result = await pool.query(
    `
    SELECT 
      p.*, 
      u.name AS author_name, 
      u.avatar AS author_avatar,
      (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS like_count,
      (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count
    FROM posts p
    JOIN users u ON p.author_id = u.id
    ORDER BY p.created_at DESC
    LIMIT $1 OFFSET $2
    `,
    [limit, offset]
  );
  return result.rows;
}

//get single post by ID
export async function getPostById(id) {
  const result = await pool.query(
    `
    SELECT 
      p.*, 
      u.name AS author_name, 
      u.avatar AS author_avatar,
      (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS like_count,
      (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count
    FROM posts p
    JOIN users u ON p.author_id = u.id
    WHERE p.id = $1
    `,
    [id]
  );
  return result.rows[0] || null;
}

//create a new post
export async function createPost({ title, content, author_id }) {
  const result = await pool.query(
    `
    INSERT INTO posts (title, content, author_id)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [title, content, author_id]
  );
  return result.rows[0];
}

//Update post (only by author)
export async function updatePost({ id, author_id, title, content }) {
  const result = await pool.query(
    `
    UPDATE posts
    SET title=$1, content=$2, updated_at=NOW()
    WHERE id=$3 AND author_id=$4
    RETURNING *
    `,
    [title, content, id, author_id]
  );
  return result.rows[0] || null;
}

//delete post (only by author)
export async function deletePost({ id, author_id }) {
  const result = await pool.query(
    `
    DELETE FROM posts
    WHERE id=$1 AND author_id=$2
    RETURNING id
    `,
    [id, author_id]
  );
  return result.rows[0] || null;
}

//like system

// Like a post (ignore if already liked)
export async function likePost({ post_id, user_id }) {
  await pool.query(
    `
    INSERT INTO likes (post_id, user_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
    `,
    [post_id, user_id]
  );
}

// Unlike a post
export async function unlikePost({ post_id, user_id }) {
  await pool.query(
    `
    DELETE FROM likes
    WHERE post_id=$1 AND user_id=$2
    `,
    [post_id, user_id]
  );
}

// Get number of likes
export async function getLikeCount(post_id) {
  const result = await pool.query(
    `
    SELECT COUNT(*)::int AS like_count
    FROM likes
    WHERE post_id=$1
    `,
    [post_id]
  );
  return result.rows[0].like_count;
}

// Check if user likes a post
export async function userLikesPost({ post_id, user_id }) {
  const result = await pool.query(
    `
    SELECT 1
    FROM likes
    WHERE post_id=$1 AND user_id=$2
    LIMIT 1
    `,
    [post_id, user_id]
  );
  return result.rowCount > 0;
}
