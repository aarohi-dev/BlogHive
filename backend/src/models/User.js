import pool from "../config/db.js"; 

//Find user by Google ID
export async function findByGoogleId(google_id) {
  const result = await pool.query(
    "SELECT * FROM users WHERE google_id = $1 LIMIT 1",
    [google_id]
  );
  return result.rows[0] || null;
}

//Find user by DB ID
export async function findById(id) {
  const result = await pool.query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );
  return user;
}

export default {
  findByGoogleId,
  findById,
  findByEmail,
  createUser,
  findOrCreate,
};
