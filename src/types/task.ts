export interface TaskI {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: Date;
}

export interface CreateTaskI {
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: Date;
}
