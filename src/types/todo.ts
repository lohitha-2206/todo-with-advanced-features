
// Types for the application that align with the Supabase database schema
export interface TaskType {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  dueDate?: string | null;
  labelIds: string[];
}

export interface LabelType {
  id: string;
  name: string;
  color: string;
}

// Types for database operations
export interface TaskDBType {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface LabelDBType {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface TaskLabelDBType {
  task_id: string;
  label_id: string;
}
