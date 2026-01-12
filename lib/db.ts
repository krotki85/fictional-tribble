import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'cmms.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS machines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    location TEXT,
    serial_number TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    machine_id INTEGER NOT NULL,
    issue_description TEXT NOT NULL,
    reporter_name TEXT,
    reporter_contact TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (machine_id) REFERENCES machines (id)
  )
`);

export interface Machine {
  id: number;
  name: string;
  description: string | null;
  location: string | null;
  serial_number: string | null;
  created_at: string;
}

export interface Report {
  id: number;
  machine_id: number;
  issue_description: string;
  reporter_name: string | null;
  reporter_contact: string | null;
  status: string;
  created_at: string;
}

export default db;
