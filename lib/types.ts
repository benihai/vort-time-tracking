export type Role = "admin" | "employee";

export interface Profile {
  id: string;
  full_name: string | null;
  role: Role;
  email: string | null;
  created_at: string;
}

export interface TimeLog {
  id: string;
  user_id: string;
  work_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
  description: string | null;
  created_at: string;
}

/** A time log joined with its owner's profile (admin timesheet view). */
export interface TimeLogWithProfile extends TimeLog {
  profiles: Pick<Profile, "full_name" | "role"> | null;
}
