import pkg from"pg";
import dotenv from "dotenv";
dotenv.config();

const {Pool} = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

//optional part to check and tell if database is connected
async function query(text,params) {
    try{
        const res = await pool.query(text,params);
        return res;
    }
    catch(err){
        console.error("error connecting to database.",err);
        throw err;
    }
}

export default {pool, query};