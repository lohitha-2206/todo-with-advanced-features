
import { supabase } from "@/integrations/supabase/client";
import { TaskType, LabelType, TaskDBType, LabelDBType, TaskLabelDBType } from "@/types/todo";

// Transform database task to application task
export const mapTaskFromDB = async (task: TaskDBType): Promise<TaskType> => {
  // Get label ids for this task
  const { data: taskLabels } = await supabase
    .from('task_labels')
    .select('label_id')
    .eq('task_id', task.id);
  
  return {
    id: task.id,
    title: task.title,
    description: task.description || "",
    completed: task.completed,
    dueDate: task.due_date,
    labelIds: taskLabels?.map(tl => tl.label_id) || []
  };
};

// Transform application task to database task
export const mapTaskToDB = (task: TaskType, userId: string): Omit<TaskDBType, 'created_at' | 'updated_at'> => {
  return {
    id: task.id,
    user_id: userId,
    title: task.title,
    description: task.description,
    completed: task.completed,
    due_date: task.dueDate || null
  };
};

// Fetch all tasks for the current user
export const fetchTasks = async (): Promise<TaskType[]> => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return [];
  
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
  
  // Map each task from the database
  const mappedTasks = await Promise.all(tasks.map(task => mapTaskFromDB(task)));
  return mappedTasks;
};

// Add a new task
export const addTask = async (task: Omit<TaskType, "id" | "completed">): Promise<TaskType | null> => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;
  
  const userId = session.session.user.id;
  
  // Insert the task
  const { data: insertedTask, error } = await supabase
    .from('tasks')
    .insert({
      title: task.title,
      description: task.description,
      due_date: task.dueDate,
      user_id: userId
    })
    .select()
    .single();
    
  if (error || !insertedTask) {
    console.error('Error adding task:', error);
    return null;
  }
  
  // Insert task-label relationships
  if (task.labelIds.length > 0) {
    const taskLabels = task.labelIds.map(labelId => ({
      task_id: insertedTask.id,
      label_id: labelId
    }));
    
    const { error: labelError } = await supabase
      .from('task_labels')
      .insert(taskLabels);
      
    if (labelError) {
      console.error('Error adding task labels:', labelError);
    }
  }
  
  return mapTaskFromDB(insertedTask);
};

// Update an existing task
export const updateTask = async (id: string, taskUpdate: Partial<TaskType>): Promise<TaskType | null> => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;
  
  const updateData: any = {};
  
  if (taskUpdate.title !== undefined) updateData.title = taskUpdate.title;
  if (taskUpdate.description !== undefined) updateData.description = taskUpdate.description;
  if (taskUpdate.completed !== undefined) updateData.completed = taskUpdate.completed;
  if (taskUpdate.dueDate !== undefined) updateData.due_date = taskUpdate.dueDate;
  
  // Update the task
  const { data: updatedTask, error } = await supabase
    .from('tasks')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
    
  if (error || !updatedTask) {
    console.error('Error updating task:', error);
    return null;
  }
  
  // Update labels if they've changed
  if (taskUpdate.labelIds !== undefined) {
    // First delete all existing labels
    await supabase
      .from('task_labels')
      .delete()
      .eq('task_id', id);
      
    // Then add the new ones
    if (taskUpdate.labelIds.length > 0) {
      const taskLabels = taskUpdate.labelIds.map(labelId => ({
        task_id: id,
        label_id: labelId
      }));
      
      await supabase
        .from('task_labels')
        .insert(taskLabels);
    }
  }
  
  return mapTaskFromDB(updatedTask);
};

// Delete a task
export const deleteTask = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);
    
  return !error;
};

// Fetch all labels for the current user
export const fetchLabels = async (): Promise<LabelType[]> => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return [];
  
  const { data: labels, error } = await supabase
    .from('labels')
    .select('*');
    
  if (error) {
    console.error('Error fetching labels:', error);
    return [];
  }
  
  return labels.map(label => ({
    id: label.id,
    name: label.name,
    color: label.color
  }));
};

// Add a new label
export const addLabel = async (label: Omit<LabelType, "id">): Promise<LabelType | null> => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;
  
  const userId = session.session.user.id;
  
  const { data: insertedLabel, error } = await supabase
    .from('labels')
    .insert({
      name: label.name,
      color: label.color,
      user_id: userId
    })
    .select()
    .single();
    
  if (error || !insertedLabel) {
    console.error('Error adding label:', error);
    return null;
  }
  
  return {
    id: insertedLabel.id,
    name: insertedLabel.name,
    color: insertedLabel.color
  };
};
