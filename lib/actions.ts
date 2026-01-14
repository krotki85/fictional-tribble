'use server';

import db, { Machine, Report } from './db';
import { revalidatePath } from 'next/cache';

export async function getMachines(): Promise<Machine[]> {
  const stmt = db.prepare('SELECT * FROM machines ORDER BY created_at DESC');
  return stmt.all() as Machine[];
}

export async function getMachine(id: number): Promise<Machine | undefined> {
  const stmt = db.prepare('SELECT * FROM machines WHERE id = ?');
  return stmt.get(id) as Machine | undefined;
}

export async function addMachine(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const location = formData.get('location') as string;
  const serial_number = formData.get('serial_number') as string;

  const stmt = db.prepare(
    'INSERT INTO machines (name, description, location, serial_number) VALUES (?, ?, ?, ?)'
  );
  
  stmt.run(name, description || null, location || null, serial_number || null);
  
  revalidatePath('/machines');
  revalidatePath('/');
}

export async function getReports(machineId?: number): Promise<Report[]> {
  let stmt;
  if (machineId) {
    stmt = db.prepare('SELECT * FROM reports WHERE machine_id = ? ORDER BY created_at DESC');
    return stmt.all(machineId) as Report[];
  } else {
    stmt = db.prepare('SELECT * FROM reports ORDER BY created_at DESC');
    return stmt.all() as Report[];
  }
}

export async function addReport(formData: FormData) {
  const machine_id = formData.get('machine_id') as string;
  const issue_description = formData.get('issue_description') as string;
  const reporter_name = formData.get('reporter_name') as string;
  const reporter_contact = formData.get('reporter_contact') as string;

  const stmt = db.prepare(
    'INSERT INTO reports (machine_id, issue_description, reporter_name, reporter_contact) VALUES (?, ?, ?, ?)'
  );
  
  stmt.run(
    parseInt(machine_id),
    issue_description,
    reporter_name || null,
    reporter_contact || null
  );
  
  revalidatePath('/machines');
  revalidatePath(`/machines/${machine_id}`);
}

export async function updateReportStatus(reportId: number, status: string) {
  const stmt = db.prepare('UPDATE reports SET status = ? WHERE id = ?');
  stmt.run(status, reportId);
  
  revalidatePath('/machines');
  revalidatePath('/');
}
