import pg from 'pg';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

/**
 * PostgreSQL connection pool (for Render.com)
 */
export const createPostgresPool = () => {
  if (!process.env.DATABASE_URL) {
    console.warn('⚠️  DATABASE_URL not set - database features disabled');
    return null;
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  pool.on('error', (err) => {
    console.error('Unexpected database error:', err);
  });

  return pool;
};

/**
 * MySQL connection pool (alternative)
 */
export const createMySQLPool = async () => {
  if (!process.env.DB_HOST) {
    console.warn('⚠️  MySQL config not set - database features disabled');
    return null;
  }

  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test connection
    await pool.query('SELECT 1');
    console.log('✅ MySQL connected');
    
    return pool;
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    return null;
  }
};

/**
 * Initialize database connection based on environment
 */
export const initDatabase = async () => {
  // For Render.com, prefer PostgreSQL
  if (process.env.DATABASE_URL) {
    const pool = createPostgresPool();
    console.log('✅ PostgreSQL pool created');
    return { type: 'postgres', pool };
  }
  
  // Fallback to MySQL if configured
  if (process.env.DB_HOST) {
    const pool = await createMySQLPool();
    return { type: 'mysql', pool };
  }

  console.log('ℹ️  No database configured - using in-memory data');
  return { type: 'none', pool: null };
};

export default { createPostgresPool, createMySQLPool, initDatabase };
