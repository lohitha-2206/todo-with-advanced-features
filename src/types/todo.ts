
export interface TaskType {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
  labelIds: string[];
}

export interface LabelType {
  id: string;
  name: string;
  color: string;
}
