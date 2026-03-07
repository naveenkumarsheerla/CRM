/* eslint-disable @typescript-eslint/no-require-imports */
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 5000,
    ssl: {
        rejectUnauthorized: false
    }
});

async function testConnection() {
    console.log('Attempting to connect to:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));
    try {
        const client = await pool.connect();
        console.log('Successfully connected to the database!');
        const res = await client.query('SELECT NOW()');
        console.log('Query result:', res.rows[0]);
        client.release();
    } catch (err) {
        console.error('Connection error:', err.message);
        console.error('Error stack:', err.stack);
    } finally {
        await pool.end();
    }
}

testConnection();
