export const taskTypes = ['default', 'urgent', 'important', 'located', null] as const;
export const taskStatuses = ['default', 'todo', 'in_progress', 'done', null] as const;

export type TaskType = typeof taskTypes[number];
export const typeCheckMap = {
    'urgent': isUrgentTask,
    'important': isImportantTask,
    'located': isLocatedTask,
}
export type TaskStatus = typeof taskStatuses[number];

export interface BaseTaskData {
    title: string;
    description: string;
    dateCreated: string;
    status: TaskStatus;
    uid: string;
    types: TaskType[];
}

export interface UrgentTaskData extends BaseTaskData {
    deadline: string;
}

export interface ImportantTaskData extends BaseTaskData {
    responsible: string;
}

export interface LocatedTaskData extends BaseTaskData {
    location: string;
}

export type TaskData = BaseTaskData & Partial<UrgentTaskData & ImportantTaskData & LocatedTaskData>;

export function isUrgentTask(task: TaskData): task is UrgentTaskData {
    return 'deadline' in task && task.deadline !== undefined && task.deadline !== '';
}

export function isImportantTask(task: TaskData): task is ImportantTaskData {
    return 'responsible' in task && task.responsible !== undefined && task.responsible !== '';
}

export function isLocatedTask(task: TaskData): task is LocatedTaskData {
    return 'location' in task && task.location !== undefined && task.location !== '';
}

export function getDefaultTaskData() {
    return {
        title: '',
        description: '',
        dateCreated: new Date().toISOString(),
        status: taskStatuses[0],
        type: taskTypes[0],
        uid: '',
        deadline: '',
        responsible: '',
        location: '',
    }
}
