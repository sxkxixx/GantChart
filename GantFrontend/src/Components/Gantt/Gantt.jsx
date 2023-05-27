import React, {Component, useEffect} from 'react';
import axios from 'axios';
import './Gantt.css'
import {gantt} from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import s from "../Main/Main.module.css";
import {ReactComponent as Exit} from "../../Assets/img/exitmodal.svg"
import {ReactComponent as Play} from "../../Assets/img/playWhite.svg"
import {ReactComponent as Stop} from "../../Assets/img/stop.svg"
import {ReactComponent as TrashWhite} from "../../Assets/img/trashWhite.svg"
import {ReactComponent as Add} from "../../Assets/img/addButton.svg"
import {ReactComponent as Del} from "../../Assets/img/deleteButton.svg"
import {ReactComponent as Clock} from "../../Assets/img/clock.svg"
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {onKanbanViewChange} from './onKanban';

window.onKanbanViewChange = onKanbanViewChange;
let taskId = null;

export default class Gantt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: ["Игорь", "Саша", "Вера", "Юля", "Артем"],
            items: ["Пункт 1", "Пункт 2", "Пункт 3", "Пункт 4", "Пункт 5", "Пункт 6"],
            isRunning: false,
            elapsedTime: 0,
            comments: [],
            currentComment: '',
        };
        this.handleAdd = this.handleAdd.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.timerIntervalId = null;
        this.handlePlayClick = this.handlePlayClick.bind(this);
        this.handleSaveClick = this.handleSaveClick.bind(this);
        this.handleRemoveClick = this.handleRemoveClick.bind(this);
    }

    handleChange = (event) => {
        this.setState({currentComment: event.target.value});
    }
    handleSubmit = (event) => {
        event.preventDefault();
        if (this.state.currentComment.trim()) {
            const newComment = {
                name: 'Фамилия Имя Отчество',
                time: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
                text: this.state.currentComment,
            };
            this.setState({
                comments: [...this.state.comments, newComment],
                currentComment: '',
            });
        }
    };
    addItem = () => {
        const newItems = [...this.state.items, ""];
        this.setState({items: newItems});
    };
    removeItem = (index) => {
        const newItems = [...this.state.items];
        newItems.splice(index, 1);
        this.setState({items: newItems});
    };
    handleItemChange = (event, index) => {
        const newItems = [...this.state.items];
        newItems[index] = event.target.value;
        this.setState({items: newItems});
    }

    handleAdd() {
        const newData = [...this.state.data, "Новый исполнитель"];
        this.setState({data: newData});
    }

    handleDelete(index) {
        const newData = [...this.state.data];
        newData.splice(index, 1);
        this.setState({data: newData});
    }

    componentWillUnmount() {
        this.stopTimer();
    }

    startTimer() {
        const startTime = Date.now() - this.state.elapsedTime;
        this.timerIntervalId = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            this.setState({elapsedTime});
        }, 10);
    }

    stopTimer() {
        clearInterval(this.timerIntervalId);
        this.timerIntervalId = null;
    }

    handlePlayClick() {
        if (this.state.isRunning) {
            this.stopTimer();
        } else {
            this.startTimer();
        }
        this.setState({isRunning: !this.state.isRunning});
    }

    handleSaveClick() {
        this.props.onSave(this.state.elapsedTime);
    }

    handleRemoveClick() {
        this.stopTimer();
        this.setState({isRunning: false, elapsedTime: 0});
    }

    formatTime(time) {
        const s = Math.floor(time / 1000 % 60);
        const m = Math.floor(time / 1000 / 60 % 60);
        const h = Math.floor(time / 1000 / 60 / 60);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }


    componentDidMount() {
        gantt.config.date_format = "%Y-%m-%d";
        gantt.init(this.ganttContainer);
        gantt.i18n.setLocale("ru"); // Руссификация
        gantt.config.links = false;
        gantt.config.show_errors = false; // отключаем баннер ошибок

        // Календарь
        gantt.config.scale_height = 80;
        gantt.config.show_tasks_outside_timescale = true;
        gantt.config.scales = [
            {unit: "month", step: 1, format: "%F, %Y"},
            {unit: "day", step: 1, format: "%j"}
        ];

        // Dropdown
        gantt.templates.grid_open = function (item) {
            if (item.$open) {
                return "<div class='my_open_icon'></div>";
            } else {
                return "<div class='my_close_icon'></div>";
            }
        };
        gantt.attachEvent("onTaskClick", function (id, e) {
            let target = e.target || e.srcElement;
            if (target.classList.contains("my_open_icon")) {
                gantt.close(id);
            } else if (target.classList.contains("my_close_icon")) {
                gantt.open(id);
            }
            return true;
        });

        // Add
        gantt.templates.grid_row_class = function (start, end, task) {
            if (task.$level >= 0) {
                return "nested_task"
            }
            return "";
        };

        // Колоны
        gantt.config.columns = [
            {
                name: "text", label: "ЗАДАЧИ", width: "*", tree: true, grid: true,
                template: function (task) {
                    if (task.end_date < new Date()) {
                        return "<span class='completed_text'>" + task.text + "</span>";
                    } else {
                        return task.text;
                    }
                }
            },
            {
                name: "checked", label: "", width: "26", template: function (task) {
                    if (task.children === 0) {
                        let banner = "";
                        if (!task.is_on_kanban) {
                            banner = "<div class='kanban-banner'>Отображать на канбане</div>";
                        }
                        return `<div class='kanban-container'>
              <input type='checkbox' ${task.is_on_kanban ? "checked" : ""} onchange='onKanbanViewChange(${task.id}, !${task.is_on_kanban})'>
              ${banner}
            </div>`;
                    }
                }
            },
            {
                name: "add", label: "", width: 44
            },
        ]

        function getForm(formName) {
            return document.getElementById(formName);
        }

        gantt.showLightbox = function (id) {
            taskId = id;
            let task = gantt.getTask(id);

            let form;
            let $new = task.$new;

            let parentTask = "";
            if (task.parent) {
                parentTask = "Базовая задача: <span style='text-decoration: underline;'>" + gantt.getTask(task.parent).text + "</span>";
            } else {
                parentTask = "Базовая задача: <span style='text-decoration: underline;'>Отсутствует</span>";
            }

            if ($new) {
                // Show the create task form
                form = getForm("create_task");

                // вывод данных
                let text = form.querySelector("[name='text']");
                let description = form.querySelector("[name='description']");
                let deadline = form.querySelector("[name='deadline']");
                let startDate = form.querySelector("[name='start_date']");
                let endDate = form.querySelector("[name='end_date']");

                form.querySelector("[id='parent_task']").value = task.parent || '';
                form.querySelector("#parent_task").innerHTML = parentTask;

                description.focus();
                text.focus();
                deadline.focus();
                startDate.focus();
                endDate.focus();

                if (task.$new && task.parent) {
                    let parentTask = gantt.getTask(task.parent);
                    description.value = "";
                    text.value = "";
                    deadline.value = parentTask.deadline ? new Date(parentTask.deadline).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
                    startDate.value = parentTask.start_date ? new Date(parentTask.start_date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
                    endDate.value = parentTask.end_date ? new Date(parentTask.end_date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
                } else {
                    description.value = task.description || "";
                    text.value = task.text || "";
                    deadline.value = task.deadline ? new Date(task.deadline).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
                    startDate.value = task.start_date ? new Date(task.start_date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
                    endDate.value = task.end_date ? new Date(task.end_date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
                }

                if (task.$new && !task.parent) {
                    // Добавляем стартовые значения для дедлайна, начальной и конечной дат
                    text.value = "";
                    deadline.value = "";
                    startDate.value = "";
                    endDate.value = "";
                }

                form.style.display = "flex";

                form.querySelector('button[type="closemodal"]').onclick = cancel;
                form.querySelector("[name='save']").onclick = save;
                form.querySelector("[name='close']").onclick = cancel;
            } else {
                // Show the task details form
                form = getForm("display_task");
                // вывод данных
                let textView = form.querySelector("[name='text1']");
                let descriptionView = form.querySelector("[name='description1']");
                let deadlineView = form.querySelector("[name='deadline1']");
                let startDateView = form.querySelector("[name='start_date1']");
                let endDateView = form.querySelector("[name='end_date1']");

                form.querySelector("[id='parent_task']").value = task.parent || '';
                form.querySelector("#parent_task").innerHTML = parentTask;

                descriptionView.focus();
                textView.focus();
                deadlineView.focus();
                startDateView.focus();
                endDateView.focus();


                descriptionView.value = task.description || "";
                textView.value = task.text || "";
                deadlineView.value = task.deadline ? new Date(task.deadline).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
                startDateView.value = task.start_date ? new Date(task.start_date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
                endDateView.value = task.end_date ? new Date(task.end_date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);

                form.style.display = "flex";

                //name="create_task"
                form.querySelector('.main_view_list').scrollTop = 0;
                form.querySelector('button[type="closemodal1"]').onclick = cancel;
                form.querySelector("[name='create_task']").onclick = function () {
                    taskId = id;
                    let displayForm = getForm("display_task");
                    displayForm.style.display = "none";
                    let parentTaskId = gantt.getSelectedId();
                    gantt.createTask(this.createTask, parentTaskId);
                }
                form.querySelector("[name='edit']").onclick = function () {
                    taskId = id;
                    let editForm = getForm("edit_task");
                    let displayForm = getForm("display_task");
                    displayForm.style.display = "none";
                    editForm.style.display = "flex";
                    let task = gantt.getTask(id);
                    editForm.querySelector('.main_view_list').scrollTop = 0;
                    editForm.querySelector("[name='text_edit']").value = task.text || "";
                    editForm.querySelector("[name='description_edit']").value = task.description || "";
                    editForm.querySelector("[name='deadline_edit']").value = task.deadline ? new Date(task.deadline).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
                    editForm.querySelector("[name='start_date_edit']").value = task.start_date ? new Date(task.start_date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
                    editForm.querySelector("[name='end_date_edit']").value = task.end_date ? new Date(task.end_date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
                    let parentTask = "";
                    if (task.parent) {
                        parentTask = "Базовая задача: <span style='text-decoration: underline;'>" + gantt.getTask(task.parent).text + "</span>";
                    } else {
                        parentTask = "Базовая задача: <span style='text-decoration: underline;'>Отсутствует</span>";
                    }
                    editForm.querySelector("[id='parent_task']").value = task.parent || '';
                    editForm.querySelector("#parent_task").innerHTML = parentTask;
                    editForm.querySelector("#parent_task").innerHTML = parentTask;
                    editForm.querySelector('button[type="closemodal3"]').onclick = function () {
                        gantt.hideLightbox();
                        editForm.style.display = "none";
                    };
                    editForm.querySelector("[name='save_edit']").onclick = edit
                    editForm.querySelector("[name='create_task_edit']").onclick = function () {
                        taskId = id;
                        let editForm = getForm("edit_task");
                        editForm.style.display = "none";
                        let parentTaskId = gantt.getSelectedId();
                        gantt.createTask(this.createTask, parentTaskId);
                    }
                    editForm.querySelector("[name='delete_edit']").onclick = remove;
                };
                form.querySelector("[name='delete']").onclick = remove;
            }
        };

        gantt.hideLightbox = function () {
            getForm("create_task").style.display = "none";
            getForm("display_task").style.display = "none";
            getForm("edit_task").style.display = "none";
            taskId = null;
        }

        gantt.config.open_tree_initially = true;

        // Изменение отображения элементов на Диаграмме
        gantt.templates.grid_file = function (obj) {
            if (obj.$level === 0)
                return "<div class='gantt_tree_icon gantt_first'><i class='fas fa-plus'></i></div>";
            else
                return "<div class='gantt_tree_icon'></div>";
        };

        gantt.templates.grid_file = function (item) {
            return "<div class='gantt_tree_icon gantt_file' style='display: none'></div>";
        };

        gantt.templates.grid_folder = function (item) {
            return `<div 
   class='gantt_tree_icon gantt_folder_${(item.$open ? "open" : "closed")}' style='display: none'>
   </div>`;
        };

        gantt.templates.task_text = function (start, end, task) {
            if (task.text) {
                return ''
            }
        };

        gantt.templates.task_class = function (start, end, task) {
            if (task.$level === 0 || task.$level === 1) {
                if (new Date() > end) {
                    return "parent-task-complete";
                } else {
                    return "parent-task";
                }
            } else {
                if (new Date() > end) {
                    return "child-task-complete";
                } else {
                    return "child-task";
                }
            }
        };

        // Get запрос задач
        axios.get(`http://127.0.0.1:8000/api/v1/gant/tasks`)
            .then(response => {
                const transformedData = this.transformData(response.data);
                gantt.parse(transformedData);
            })
            .catch(error => {
                console.error(error);
            });

        gantt.config.drag_move = true;

        gantt.attachEvent("onBeforeTaskDrag", function (id, mode, e) {
            return true;
        });

        gantt.attachEvent("onAfterTaskDrag", function (id, mode, e) {
            let task = gantt.getTask(id);
            let parentTask = gantt.getTask(task.parent);
            if (parentTask !== undefined) {
                if (task.start_date < parentTask.start_date || task.end_date > parentTask.end_date) {
                    toast.warn('Даты начала и конца задачи не могут превышать даты начала и конца родительской задачи', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                    return
                }
                if (new Date(task.end_date).getTime() < new Date(task.start_date).getTime()) {
                    gantt.changeTaskDates(id, task.start_date, task.end_date);
                    return;
                }
            }
            axios.post(`http://127.0.0.1:8000/api/v1/gant/task/${id}/edit_dates`, {
                planned_start_date: new Date(task.start_date).toISOString().slice(0, 10),
                planned_finish_date: new Date(task.end_date).toISOString().slice(0, 10),
                deadline: task.deadline
            })
                .then(response => {
                    console.log(response.data);
                    toast.success('Дата успешно изменена', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                })
                .catch(error => {
                    console.error(error);
                    toast.warn('Дата не изменена', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                });
        });


        function save(id) {
            const form = getForm("create_task");
            // Получаем значения полей формы
            const parentId = document.getElementById("parent_task").value;
            const text = document.getElementsByName("text")[0].value;
            const description = form.querySelector("[name='description']").value.trim();
            const deadline = document.getElementsByName("deadline")[0].value;
            const start_date = document.getElementsByName("start_date")[0].value;
            const end_date = document.getElementsByName("end_date")[0].value;
            // let task = gantt.getTask(id);
            let parentTask = document.getElementById("parent_task").value;

            // Валидация полей формы
            if (!text) {
                toast.error("Введите название задачи", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                })
            }

            if (start_date < parentTask.start_date || end_date > parentTask.end_date) {
                toast.error("Дата начала или конца задачи не может быть раньше начала или позже конца родительской задачи", {
                    position: "top-right",
                    autoClose: 6000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                })
            }


            if (!start_date || !end_date) {
                toast.warn("Введите даты начала и конца задачи", {
                    position: "top-right",
                    autoClose: 6000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }

            if (new Date(start_date).getTime() > new Date(end_date).getTime()) {
                toast.error("Дата начала не может быть позже даты окончания задачи", {
                    position: "top-right",
                    autoClose: 6000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }


            // Форматируем даты в формат "%Y-%m-%d"
            const formatter = gantt.date.date_to_str("%Y-%m-%d");
            const start_date_formatted = formatter(new Date(start_date));
            const end_date_formatted = formatter(new Date(end_date));

            // Отправляем POST запрос на сервер для создания новой задачи
            axios.post(`http://127.0.0.1:8000/api/v1/gant/task/create`, {
                task: {
                    parent_id: parentId ? parentId : null,
                    project_id: 1,
                    team_id: 1,
                    name: text,
                    description: description,
                    deadline: deadline ? formatter(new Date(deadline)) : formatter(new Date()),
                    planned_start_date: start_date_formatted,
                    planned_finish_date: end_date_formatted,
                },
                stages: [
                    {description: "string"},
                    {description: "string"}
                ]
            }).then(response => {
                form.style.display = "none";
                console.log(response.data);
                toast.success("Задача создана", {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setTimeout(() => {
                    window.location.reload();
                }, 1200);
            }).catch(error => {
                console.error(error);
                toast.warning("Задача не создана", {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            });
        }

        function edit() {
            let task = gantt.getTask(taskId);

            const form = getForm("edit_task");
            // Получаем значения полей формы
            const parentId = document.getElementById("parent_task").value;
            const text = document.getElementsByName("text_edit")[0].value;
            const description = form.querySelector("[name='description_edit']").value.trim();
            const deadline = document.getElementsByName("deadline_edit")[0].value;
            const start_date = document.getElementsByName("start_date_edit")[0].value;
            const end_date = document.getElementsByName("end_date_edit")[0].value;

            // Валидация полей формы

            // Форматируем даты в формат "%Y-%m-%d"
            const formatter = gantt.date.date_to_str("%Y-%m-%d");
            const start_date_formatted = formatter(new Date(start_date));
            const end_date_formatted = formatter(new Date(end_date));

            // Отправляем POST запрос на сервер для создания новой задачи
            axios.post(`http://127.0.0.1:8000/api/v1/gant/task/${task.id}/edit`, {
                task: {
                    parent_id: parentId ? parentId : null,
                    project_id: 1,
                    team_id: 1,
                    name: text,
                    description: description,
                    deadline: deadline ? formatter(new Date(deadline)) : formatter(new Date()),
                    planned_start_date: start_date_formatted,
                    planned_finish_date: end_date_formatted,
                },
                stages: [
                    {description: "string"},
                    {description: "string"}
                ]
            }).then(response => {
                gantt.updateTask(taskId);
                form.style.display = "none";
                console.log(response.data);
                toast.success("Задача Редактирована", {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setTimeout(() => {
                    window.location.reload();
                }, 1200);
            }).catch(error => {
                console.error(error);
                toast.warning("Задача не Редактирована", {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            });
        }

        function cancel() {
            let task = gantt.getTask(taskId);

            if (task.$new)
                gantt.deleteTask(task.id);
            gantt.hideLightbox();
        }

        function remove() {
            let task = gantt.getTask(taskId);
            axios.delete(`http://127.0.0.1:8000/api/v1/gant/task/${task.id}/del`)
                .then(response => {
                    console.log(response.data);
                    toast.success("Задача удалена", {
                        position: "top-right",
                        autoClose: 1200,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                })
                .catch(error => {
                    console.error(error);
                });
            gantt.deleteTask(taskId);
            gantt.hideLightbox();
        }
    }

    transformData(data) {
        const taskMap = new Map();

        function transformTask(task, parentId = 0) {
            const taskId = task.id;

            taskMap.set(taskId, {
                id: taskId,
                text: task.name,
                description: task.description,
                is_on_kanban: task.is_on_kanban,
                is_completed: task.is_completed,
                start_date: task.planned_start_date,
                end_date: task.planned_finish_date,
                deadline: task.deadline,
                open: true,
                parent: parentId,
                children: task.children.length
            });

            if (task.children) {
                task.children.forEach((child) => {
                    transformTask(child, taskId);
                });
            }
        }

        data.forEach((task) => {
            transformTask(task);
        });

        const transformedData = {
            data: Array.from(taskMap.values()),
        };

        return transformedData;
    };

    render() {
        const {isRunning, elapsedTime} = this.state;
        return (
            <>
                <div className={s.elements}>
                    <div className={s.dropdown}>
                        <select name="tasks" id="tasks">
                            <option>Мои Задачи</option>
                        </select>
                        <select name="projects" id="projects">
                            <option>Проект</option>
                        </select>
                        <select name="teams" id="teams">
                            <option>Команда</option>
                        </select>
                    </div>
                    <div className={s.button}>
                        <button onClick={() => gantt.createTask(this.createTask)}>Создать Задачу</button>
                    </div>
                </div>
                {/*===================Форма при создании задачи===============================*/}
                <div id="create_task" className="modal" style={{display: "none"}}>
                    <div className="create-form">
                        <div className='main'>
                            <div className="title_create">
                                <input
                                    placeholder='Введите название'
                                    type="text"
                                    name="text"
                                    className='create_title'
                                />
                                <p id='parent_task'></p>
                            </div>
                            <div className='main_view_list'>
                                <div className="project">
                                    <span>Проект</span>
                                    <select>
                                        <option>Название проекта</option>
                                        <option>ЛК Гант</option>
                                        <option>ЛК Канбан</option>
                                    </select>
                                </div>
                                <div className='elements'>
                                    <div className="element">
                                        <span>Дедлайн</span>
                                        <input type="date" name='deadline'/>
                                    </div>
                                    <div className="element">
                                        <span>Тег команды</span>
                                        <select>
                                            <option>#Тег_команды</option>
                                            <option>#Гант</option>
                                            <option>#Канбан</option>
                                        </select>
                                    </div>
                                    <div className="date">
                                        <span>Планируемые сроки выполнения</span>
                                        <div className='dateList'>
                                            <input type="date" name='start_date'/>
                                            -
                                            <input type="date" name='end_date'/>
                                        </div>
                                    </div>
                                </div>
                                <div className="description">
                                    <p><textarea name="description" placeholder='Введите описание задачи...'></textarea>
                                    </p>
                                </div>
                                <div className="name">
                                    <div className='nameList'>
                                        <span>Постановщик</span>
                                        <input type="text" placeholder='ФИО' readOnly={true}/>
                                    </div>
                                    <div className='nameList'>
                                        <span>Ответственный</span>
                                        <select>
                                            <option>Выберите</option>
                                            <option>Игорь</option>
                                            <option>Саша</option>
                                            <option>Вера</option>
                                            <option>Юля</option>
                                            <option>Артем</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="performers">
                                    <div className="performers_title">
                                        <span>Исполнители</span>
                                        <button onClick={this.handleAdd}><Add/></button>
                                    </div>
                                    {this.state.data.map((performer, index) => (
                                        <div>
                                            <select key={index}>
                                                <option>{performer}</option>
                                            </select>
                                            <button onClick={() => this.handleDelete(index)}><Del/></button>
                                        </div>
                                    ))}
                                </div>
                                <div className='check_list'>
                                    <div className='check_list_title'>
                                        <span>Чек-лист</span>
                                        <button onClick={this.addItem}><Add/></button>
                                    </div>
                                    <div className='list'>
                                        {this.state.items.map((item, index) => (
                                            <div className='check_list_elements' key={index}>
                                                <input type="checkbox"/>
                                                <input type="text"
                                                       className='check_list_text'
                                                       value={item}
                                                       onChange={(event) => this.handleItemChange(event, index)}
                                                />
                                                <button onClick={() => this.removeItem(index)}><Del/></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className='buttons'>
                                    <input className='save' type="button" name="save" value="Сохранить"/>
                                    <input className='cancel' type="button" name="close" value="Отменить"/>
                                </div>
                            </div>
                        </div>
                        <div className='closeButton'>
                            <button type='closemodal' className='closemodal'><Exit/></button>
                        </div>
                    </div>
                </div>
                {/*===================Форма при просмотре задачи==============================*/}
                <div id="display_task" className="modal" style={{display: "none"}}>
                    <div className="view-form">
                        <div className='main_view'>
                            <div className="title">
                                <input
                                    placeholder='Введите название'
                                    type="text"
                                    name="text1"
                                    className='view_title'
                                    readOnly={true}
                                />
                                <p id='parent_task'></p>
                            </div>
                            <div className='main_view_list'>
                                <div className="project">
                                    <span>Проект</span>
                                    <select disabled>
                                        <option>Название проекта</option>
                                        <option>ЛК Гант</option>
                                        <option>ЛК Канбан</option>
                                    </select>
                                </div>
                                <div className='elements'>
                                    <div className="element">
                                        <span>Дедлайн</span>
                                        <input type="date" name='deadline1' readOnly={true}/>
                                    </div>
                                    <div className="element">
                                        <span>Тег команды</span>
                                        <select disabled>
                                            <option>#Тег_команды</option>
                                            <option>#Гант</option>
                                            <option>#Канбан</option>
                                        </select>
                                    </div>
                                    <div className="date">
                                        <span>Планируемые сроки выполнения</span>
                                        <div className='dateList'>
                                            <input type="date" name='start_date1' readOnly={true}/>
                                            <p>-</p>
                                            <input type="date" name='end_date1' readOnly={true}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="description">
                                    <p><textarea name="description1"
                                                 placeholder='Описание задачи' readOnly={true}></textarea>
                                    </p>
                                </div>
                                <div className="name">
                                    <div className='nameList'>
                                        <span>Постановщик</span>
                                        <input type="text" placeholder='ФИО' readOnly={true}/>
                                    </div>
                                    <div className='nameList'>
                                        <span>Ответственный</span>
                                        <input type="text" placeholder='ФИО' readOnly={true}/>
                                    </div>
                                </div>
                                <div className='performers'>
                                    <span>Исполнители</span>
                                    {this.state.data.map((performer, index) => (
                                        <div key={index}>
                                            <input type="text" value={performer} readOnly={true}/>
                                        </div>
                                    ))}
                                </div>
                                <div className='check_list'>
                                    <div className='check_list_title'>
                                        <span>Чек-лист</span>
                                    </div>
                                    <div className='list_view'>
                                        {this.state.items.map((item, index) => (
                                            <div className='check_list_elements' key={index}>
                                                <input type="checkbox"/>
                                                <p className='check_list_text2'>{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className='timer'>
                                    <div className='timer_top'>
                                        <span>Таймер</span>
                                        <div className='timer_top_elements'>
                                            <p><Clock/>{this.formatTime(elapsedTime)}</p>
                                            <div className='timer_button'>
                                                <button className='play_time' name="play"
                                                        onClick={this.handlePlayClick}>
                                                    {isRunning ? <Stop/> : <Play/>}
                                                </button>
                                                <button className='save_time' name="save_time"
                                                        onClick={this.handleSaveClick}>Сохранить
                                                </button>
                                                <button className='remove_time' name="remove_time"
                                                        onClick={this.handleRemoveClick}><TrashWhite/></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='timer_bottom'>
                                        <span>Затраченное время</span>
                                        <div className='timer_bottom_elements'>
                                            <p>00:00:00</p>
                                            <input type="text" placeholder='ФИО' readOnly={true}/>
                                        </div>
                                    </div>
                                </div>
                                <div className='buttons'>
                                    <input className='edit_view' type="button" name="edit" value="Редактировать"/>
                                    <input className='create_view' type="button" name="create_task"
                                           value="Создать подзадачу"/>
                                    <input className='remove_view' type="button" name="delete" value="Удалить задачу"/>
                                </div>
                                <div className="comments">
                                    <div className="comments_input">
                                        <span>Комментарии</span>
                                        <form onSubmit={this.handleSubmit}>
                                            <input type="text" placeholder="Введите комментарий..."
                                                   value={this.state.currentComment} onChange={this.handleChange}/>
                                        </form>
                                    </div>
                                    <div className="comments_output">
                                        {this.state.comments.map((comment, index) => (
                                            <div className="comments_output_item" key={index}>
                                                <div className="comments_output_title">
                                                    <p className="comments_output_name">{comment.name}</p>
                                                    <p className="comments_output_time">{comment.time}</p>
                                                </div>
                                                <p className="comments_output_text">{comment.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='closeButton'>
                            <button type='closemodal1' className='closemodal'><Exit/></button>
                        </div>
                    </div>
                </div>
                {/*===================Редактирование задачи===================================*/}
                <div id="edit_task" className="modal" style={{display: "none"}}>
                    <div className="create-form">
                        <div className='main_view'>
                            <div className="title_edit">
                                <input
                                    placeholder='Введите название'
                                    type="text"
                                    name="text_edit"
                                    className='create_title'
                                />
                                <p id='parent_task'></p>
                            </div>
                            <div className='main_view_list'>
                                <div className="project">
                                    <span>Проект</span>
                                    <select>
                                        <option>Название проекта</option>
                                        <option>ЛК Гант</option>
                                        <option>ЛК Канбан</option>
                                    </select>
                                </div>
                                <div className='elements'>
                                    <div className="element">
                                        <span>Дедлайн</span>
                                        <input type="date" name='deadline_edit'/>
                                    </div>
                                    <div className="element">
                                        <span>Тег команды</span>
                                        <select>
                                            <option>#Тег_команды</option>
                                            <option>#Гант</option>
                                            <option>#Канбан</option>
                                        </select>
                                    </div>
                                    <div className="date">
                                        <span>Планируемые сроки выполнения</span>
                                        <div className='dateList'>
                                            <input type="date" name='start_date_edit'/>
                                            -
                                            <input type="date" name='end_date_edit'/>
                                        </div>
                                    </div>
                                </div>
                                <div className="description">
                                    <p><textarea name="description_edit"
                                                 placeholder='Введите описание задачи...'></textarea>
                                    </p>
                                </div>
                                <div className="name">
                                    <div className='nameList'>
                                        <span>Постановщик</span>
                                        <input type="text" placeholder='Введите Имя'/>
                                    </div>
                                    <div className='nameList'>
                                        <span>Ответственный</span>
                                        <select>
                                            <option>Выберите</option>
                                            <option>Игорь</option>
                                            <option>Саша</option>
                                            <option>Вера</option>
                                            <option>Юля</option>
                                            <option>Артем</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="performers">
                                    <div className="performers_title">
                                        <span>Исполнители</span>
                                        <button onClick={this.handleAdd}><Add/></button>
                                    </div>
                                    {this.state.data.map((performer, index) => (
                                        <div key={index}>
                                            <select>
                                                <option>{performer}</option>
                                            </select>
                                            <button onClick={() => this.handleDelete(index)}><Del/></button>
                                        </div>
                                    ))}
                                </div>
                                <div className='check_list_edit'>
                                    <div className='check_list_title'>
                                        <span>Чек-лист</span>
                                        <button onClick={this.addItem}><Add/></button>
                                    </div>
                                    <div className='list'>
                                        {this.state.items.map((item, index) => (
                                            <div className='check_list_elements' key={index}>
                                                <input type="checkbox"/>
                                                <input type="text"
                                                       className='check_list_text'
                                                       value={item}
                                                       onChange={(event) => this.handleItemChange(event, index)}
                                                />
                                                <button onClick={() => this.removeItem(index)}><Del/></button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className='timer_bottom'>
                                        <span>Затраченное время</span>
                                        <div className='timer_bottom_elements'>
                                            <p>00:00:00</p>
                                            <select>
                                                <option>Выберите</option>
                                                <option>Игорь</option>
                                                <option>Саша</option>
                                                <option>Вера</option>
                                                <option>Юля</option>
                                                <option>Артем</option>
                                            </select>
                                            <Del/>
                                        </div>
                                    </div>
                                </div>
                                <div className='buttons'>
                                    <input className='edit_view' type="button" name="save_edit" value="Сохранить"/>
                                    <input className='create_view' type="button" name="create_task_edit"
                                           value="Создать подзадачу"/>
                                    <input className='remove_view' type="button" name="delete_edit"
                                           value="Удалить задачу"/>
                                </div>
                            </div>
                        </div>
                        <div className='closeButton'>
                            <button type='closemodal3' className='closemodal'><Exit/></button>
                        </div>
                    </div>
                </div>
                {/*===========================================================================*/}
                <div
                    ref={(input) => {
                        this.ganttContainer = input
                    }}
                    style={{width: '90%', height: '85%'}}
                ></div>
            </>
        );
    }
}
