import { Client } from 'pg';

const connectionString = "postgresql://admin:399cd5fb4da94ae0@db-tnttawebdb1-a667f8eb.malikbusiness.cloud:443/postgres?sslmode=require";

async function test() {
  const client = new Client({
    connectionString,
  });
  try {
    console.log("Connecting...");
    await client.connect();
    console.log("Connected successfully!");
    const res = await client.query('SELECT NOW()');
    console.log("Result:", res.rows[0]);
    await client.end();
  } catch (err) {
    console.error("Connection error:", err);
  }
}

test();
