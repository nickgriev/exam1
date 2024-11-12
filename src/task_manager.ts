import { SavingProvider } from "./saving_provider.js";
import { TaskData, TaskStatus, taskStatuses, TaskType, taskTypes, typeCheckMap } from "./task.js";
import { UIUpdater } from "./ui_updater.js";

export class TaskManager {
    private _tasks: TaskData[] = [];
    private _filterByType: TaskType | null = null;
    private _filterByStatus: TaskStatus | null = null;
    private savingProvider?: SavingProvider<TaskData[]>;
    private uiUpdater?: UIUpdater;

    get tasks() {
        return this._tasks;
    }

    set tasks(tasks: TaskData[]) {
        this._tasks = tasks;
        this.uiUpdater?.updateUI(this._tasks);
        this.savingProvider?.save(this._tasks);
    }

    get filterByType(): TaskType | null {
        return this._filterByType;
    }

    set filterByType(filter: TaskType) {
        this._filterByType = filter;
        this.uiUpdater?.updateUI(this.filterTasksByType(filter), true, false);
    }

    get filterByStatus(): TaskStatus | null {
        return this._filterByStatus;
    }

    set filterByStatus(filter: TaskStatus) {
        this._filterByStatus = filter;
        this.uiUpdater?.updateUI(this.filterTasksByStatus(filter), false, true);
    }

    constructor(savingProvider?: SavingProvider<TaskData[]>, uiUpdater?: UIUpdater) {
        this.savingProvider = savingProvider;
        this.uiUpdater = uiUpdater;
    }

    loadTasks() {
        this.tasks = this.savingProvider?.load() ?? [];
        this.tasks.forEach(t => {
            const types = this._generateTypes(t);
            this.editTask({ ...t, types });
        });
    }

    addTask<T extends TaskData>(task: Omit<T, 'uid' | 'type'>) {
        const taskWithId = {
            ...task,
            uid: this.tasks.length.toString()
        } as T;

        const types = this._generateTypes(taskWithId);
        const taskWithType = {
            ...taskWithId,
            types
        } as T;

        this.tasks = [...this.tasks, taskWithType];
    }

    editTask<T extends TaskData>(taskChanges: Partial<T> & { uid: string }) {
        const index = this.tasks.findIndex(t => t.uid === taskChanges.uid);
        if (index !== -1) {
            this.tasks[index] = {
                ...this.tasks[index],
                ...taskChanges
            };
        } else {
            throw new Error('Task not found');
        }
    }

    deleteTask(uid: string) {
        this.tasks = this.tasks.filter(t => t.uid !== uid);
    }

    filterTasksByType(filter: TaskType) {
        if (filter === taskTypes[0]) {
            return this.tasks;
        }
        return this.tasks.filter(t => t.types.includes(filter));
    }

    filterTasksByStatus(filter: TaskStatus) {
        if (filter === taskStatuses[0]) {
            return this.tasks;
        }

        return this.tasks.filter(t => t.status === filter);
    }


    _generateTypes(task: TaskData) {
        return Object.keys(typeCheckMap).filter(key => typeCheckMap[key as keyof typeof typeCheckMap](task)) as TaskType[];
    }
}
