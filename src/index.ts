import { TaskData, TaskStatus, TaskType } from "./task.js";

import { LocalStorageSavingProvider } from "./saving_provider.js";
import { TaskManager } from "./task_manager.js";
import { UIUpdater } from "./ui_updater.js";

const savingProvider = new LocalStorageSavingProvider<TaskData[]>('tasks');
const uiUpdater = new UIUpdater();
const taskManager = new TaskManager(savingProvider, uiUpdater);

taskManager.loadTasks();

const addTaskAction = (task: TaskData) => {
    console.log('addTaskAction', task);
    taskManager.addTask(task);
}

const editTaskAction = (task: TaskData) => {
    console.log('editTaskAction', task);
    taskManager.editTask(task);
}

const deleteTaskAction = (task: TaskData) => {
    console.log('deleteTaskAction', task);
    taskManager.deleteTask(task.uid);
}

const filterByTypeAction = (filter: TaskType) => {
    console.log('filterByTypeAction', filter);
    taskManager.filterByType = filter;
}

const filterByStatusAction = (filter: TaskStatus) => {
    console.log('filterByStatusAction', filter);
    taskManager.filterByStatus = filter;
}

const getCurrentTypeFilter = () => {
    console.log('getCurrentTypeFilter');
    return taskManager.filterByType;
}

const getCurrentStatusFilter = () => {
    console.log('getCurrentStatusFilter');
    return taskManager.filterByStatus;
}

uiUpdater.onAddTask(addTaskAction);
uiUpdater.onEditTask(editTaskAction);
uiUpdater.onDeleteTask(deleteTaskAction);
uiUpdater.onFilterByType(filterByTypeAction);
uiUpdater.onFilterByStatus(filterByStatusAction);
uiUpdater.onGetCurrentTypeFilter(getCurrentTypeFilter);
uiUpdater.onGetCurrentStatusFilter(getCurrentStatusFilter);
uiUpdater.updateUI(taskManager.tasks);

