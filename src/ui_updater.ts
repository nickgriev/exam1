import { getDefaultTaskData, TaskData, TaskStatus, taskStatuses, TaskType, taskTypes } from "./task.js";

export class UIUpdater {
    private addTaskAction?: (task: TaskData) => void;
    private editTaskAction?: (task: TaskData) => void;
    private deleteTaskAction?: (task: TaskData) => void;
    private filterByTypeTaskAction?: (filter: TaskType) => void;
    private filterByStatusTaskAction?: (filter: TaskStatus) => void;

    private getCurrentTypeFilter?: () => TaskType;
    private getCurrentStatusFilter?: () => TaskStatus;
    updateUI(tasks: TaskData[], filteredByType: boolean = false, filteredByStatus: boolean = false) {
        const taskList = document.getElementById('task-list');
        if (taskList) {
            taskList.innerHTML = '';
            const filterByTypeSelect = document.createElement('select');
            filterByTypeSelect.addEventListener('change', () => {
                this.filterByTypeTaskAction?.(filterByTypeSelect.value as TaskType);
            });
            filterByTypeSelect.innerHTML = '';
            for (const filter of taskTypes) {
                if (filter === null) {
                    continue;
                }
                const option = document.createElement('option');
                option.value = filter;
                option.textContent = filter;
                option.addEventListener('click', () => {
                    filterByTypeSelect.value = filter;
                });
                filterByTypeSelect.appendChild(option);
            }
            filterByTypeSelect.value = filteredByType ? this.getCurrentTypeFilter?.() ?? taskTypes[0] : taskTypes[0];
            taskList.appendChild(filterByTypeSelect);

            const filterByStatusSelect = document.createElement('select');
            filterByStatusSelect.addEventListener('change', () => {
                this.filterByStatusTaskAction?.(filterByStatusSelect.value as TaskStatus);
            });
            filterByStatusSelect.innerHTML = '';
            for (const filter of taskStatuses) {
                if (filter === null) {
                    continue;
                }
                const option = document.createElement('option');
                option.value = filter;
                option.textContent = filter;
                filterByStatusSelect.appendChild(option);
            }
            filterByStatusSelect.value = filteredByStatus ? this.getCurrentStatusFilter?.() ?? taskStatuses[0] : taskStatuses[0];
            taskList.appendChild(filterByStatusSelect);

            tasks.forEach(task => {
                const taskItem = document.createElement('li');

                for (const [key, value] of Object.entries(task)) {
                    const taskField = document.createElement('span');
                    taskField.title = key;
                    taskField.textContent = value;
                    taskItem.appendChild(taskField);
                }

                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.addEventListener('click', () => {
                    this.deleteTaskAction?.(task);
                });
                taskItem.appendChild(removeButton);

                taskList.appendChild(taskItem);
            });
        }

        const taskForm = document.getElementById('task-form');
        if (taskForm) {
            taskForm.innerHTML = '';

            const requiredFields = ['title', 'description', 'dateCreated'];

            for (const [key, value] of Object.entries(getDefaultTaskData())) {
                if (key === 'type') {
                    continue;
                }

                const label = document.createElement('label');
                label.textContent = key;
                label.htmlFor = key;
                taskForm.appendChild(label);

                if (key === 'status') {
                    const statusSelect = document.createElement('select');
                    statusSelect.name = 'status';
                    statusSelect.innerHTML = '';
                    for (const filter of taskStatuses) {
                        if (filter === null) {
                            continue;
                        }
                        const option = document.createElement('option');
                        option.value = filter;
                        option.textContent = filter;
                        option.addEventListener('click', () => {
                            statusSelect.value = filter;
                        });
                        statusSelect.appendChild(option);
                    }
                    statusSelect.value = value;
                    taskForm.appendChild(statusSelect);
                } else {
                    const taskField = document.createElement('input') as HTMLInputElement;
                    taskField.type = 'text';
                    taskField.name = key;
                    taskField.value = value;
                    if (requiredFields.includes(key)) {
                        taskField.required = true;
                    }

                    taskField.addEventListener('input', () => {
                        taskField.setCustomValidity('');

                        if (taskField.name === 'uid') {
                            taskField.value = taskField.value.trim();
                            const submitButton = taskForm.querySelector('button[type="submit"]');
                            if (taskField.value !== '') {
                                if (submitButton) {
                                    submitButton.textContent = 'Edit Task';
                                }
                            } else {
                                if (submitButton) {
                                    submitButton.textContent = 'Add Task';
                                }
                            }
                        }
                    });
                    taskForm.appendChild(taskField);
                }
            }

            const submitButton = document.createElement('button');
            submitButton.textContent = 'Add Task';
            submitButton.type = 'submit';
            taskForm.appendChild(submitButton);

            submitButton.addEventListener('click', (e) => {
                e.preventDefault();
                for (const requiredField of requiredFields) {
                    const taskField = taskForm.querySelector(`[name="${requiredField}"]`) as HTMLInputElement;
                    if (!taskField || !taskField.value) {
                        alert(`${requiredField} is required`);
                        return;
                    }
                }
                const task = Object.fromEntries(new FormData(taskForm as HTMLFormElement).entries());
                if (task.uid) {
                    try {
                        this.editTaskAction?.(task as unknown as TaskData);
                    } catch {
                        alert('Error editing task');
                    }
                } else {
                    console.log('addTaskAction', task);
                    this.addTaskAction?.(task as unknown as TaskData);
                }
            });
        }
    }

    onAddTask(action: (task: TaskData) => void) {
        this.addTaskAction = action;
    }

    onEditTask(action: (task: TaskData) => void) {
        this.editTaskAction = action;
    }

    onDeleteTask(action: (task: TaskData) => void) {
        this.deleteTaskAction = action;
    }

    onFilterByType(action: (filter: TaskType) => void) {
        this.filterByTypeTaskAction = action;
    }

    onFilterByStatus(action: (filter: TaskStatus) => void) {
        this.filterByStatusTaskAction = action;
    }

    onGetCurrentTypeFilter(action: () => TaskType) {
        this.getCurrentTypeFilter = action;
    }

    onGetCurrentStatusFilter(action: () => TaskStatus) {
        this.getCurrentStatusFilter = action;
    }
}