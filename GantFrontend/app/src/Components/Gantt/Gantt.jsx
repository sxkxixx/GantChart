import React, {Component, useEffect} from 'react';
import axios from 'axios';
import './Gantt.css'
import {gantt} from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import s from "../Main/Main.module.css";
import {ReactComponent as Exit} from "../../Assets/img/exitmodal.svg"
import {ReactComponent as Play} from "../../Assets/img/playWhite.svg"
import {ReactComponent as TrashWhite} from "../../Assets/img/trashWhite.svg"
import {ReactComponent as Add} from "../../Assets/img/addButton.svg"
import {ReactComponent as Del} from "../../Assets/img/deleteButton.svg"
import {ReactComponent as Clock} from "../../Assets/img/clock.svg"
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {onKanbanViewChange} from './onJanban';

window.onKanbanViewChange = onKanbanViewChange;
let taskId = null;

export default class Gantt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    componentDidMount() {
        gantt.config.date_format = "%Y-%m-%d";
        gantt.init(this.ganttContainer);
        gantt.i18n.setLocale("ru"); // Руссификация

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
            {name: "text", label: "ЗАДАЧИ", width: "*", tree: true},
            {
                name: "checked", label: "", width: "24", template: function (task) {
                    if (task.children === 0) {
                        let banner = "";
                        if (!task.is_on_kanban) {
                            banner = "<div class='kanban-banner'>Добавить на канбан</div>";
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
            }
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
            }else{
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
                form.querySelector("[name='delete']").onclick = remove;
            }
        };

        gantt.hideLightbox = function () {
            getForm("create_task").style.display = "none";
            getForm("display_task").style.display = "none";
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
                return "parent-task";
            } else {
                return "child-task";
            }
        }

        // Get запрос задач
        axios.get('http://localhost:8000/api/v1/gant/tasks')
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
            if (new Date(task.end_date).getTime() > new Date(task.deadline).getTime()) {
                toast.error("Дата конца не может быть позже даты дедлайна задачи", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                // Revert the task to its original position
                gantt.changeTaskDates(id, task.start_date, task.end_date);
                return;
            }
            axios.post(`http://localhost:8000/api/v1/gant/task/${id}/edit_dates`, {
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
                });
        });


        function save() {
            const form = getForm("create_task");
            // Получаем значения полей формы
            const parentId = document.getElementById("parent_task").value;
            const text = document.getElementsByName("text")[0].value;
            const description = form.querySelector("[name='description']").value.trim();
            const deadline = document.getElementsByName("deadline")[0].value;
            const start_date = document.getElementsByName("start_date")[0].value;
            const end_date = document.getElementsByName("end_date")[0].value;

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

            if (start_date < parentId || parentId > end_date) {
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

            if (!deadline) {
                toast.error("Выберите дедлайн задачи", {
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

            if (new Date(end_date).getTime() > new Date(deadline).getTime()) {
                toast.error("Дата конца не может быть позже даты дедлайна задачи", {
                    position: "top-right",
                    autoClose: 5000,
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
            axios.post('http://127.0.0.1:8000/api/v1/gant/task/create', {
                parent_id: parentId ? parentId : null,
                project_id: 1,
                team_id: 1,
                name: text,
                description: description,
                deadline: deadline ? formatter(new Date(deadline)) : null,
                planned_start_date: start_date_formatted,
                planned_finish_date: end_date_formatted,
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
            axios.delete(`http://localhost:8000/api/v1/gant/task/${task.id}/del`)
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

        return (
            <>
                <div className={s.elements}>
                    <div className={s.dropdown}>
                        <select name="tasks" id="tasks">
                            <option>Мои Задачи</option>
                        </select>
                        <select name="projects" id="projects">
                            <option>Проект 123</option>
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
                            <div className="title">
                                <input
                                    placeholder='Введите название'
                                    type="text"
                                    name="text"
                                    className='create_title'
                                />
                                <p id='parent_task'></p>
                            </div>
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
                                <p><textarea name="description" placeholder='Введите описание задачи...'></textarea></p>
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
                            <div className='performers'>
                                <div className='performers_title'>
                                    <span>Исполнители</span>
                                    <button><Add/></button>
                                </div>
                                <div>
                                    <select>
                                        <option>Выберите</option>
                                        <option>Игорь</option>
                                        <option>Саша</option>
                                        <option>Вера</option>
                                        <option>Юля</option>
                                        <option>Артем</option>
                                    </select>
                                    <button><Del/></button>
                                </div>
                            </div>
                            <div className='check_list'>
                                <div className='check_list_title'>
                                    <span>Чек-лист</span>
                                    <button><Add/></button>
                                </div>
                                <div className='list'>
                                    <div className='check_list_elements'>
                                        <input type="checkbox"/>
                                        <input type="text" className='check_list_text' value='Пункт 1'/>
                                        <button><Del/></button>
                                    </div>
                                    <div className='check_list_elements'>
                                        <input type="checkbox"/>
                                        <input type="text" className='check_list_text' value='Пункт 2'/>
                                        <button><Del/></button>
                                    </div>
                                    <div className='check_list_elements'>
                                        <input type="checkbox"/>
                                        <input type="text" className='check_list_text' value='Пункт 3'/>
                                        <button><Del/></button>
                                    </div>
                                    <div className='check_list_elements'>
                                        <input type="checkbox"/>
                                        <input type="text" className='check_list_text' value='Пункт 4'/>
                                        <button><Del/></button>
                                    </div>
                                    <div className='check_list_elements'>
                                        <input type="checkbox"/>
                                        <input type="text" className='check_list_text' value='Пункт 5'/>
                                        <button><Del/></button>
                                    </div>
                                    <div className='check_list_elements'>
                                        <input type="checkbox"/>
                                        <input type="text" className='check_list_text' value='Пункт 6'/>
                                        <button><Del/></button>
                                    </div>
                                </div>
                            </div>
                            <div className='buttons'>
                                <input className='save' type="button" name="save" value="Сохранить"/>
                                <input className='cancel' type="button" name="close" value="Отменить"/>
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
                                <select>
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
                                    <select aria-readonly={true}>
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
                                <p><textarea name="description1" placeholder='Введите описание задачи...'></textarea>
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
                                <input type="text" placeholder='ФИО' readOnly={true}/>
                            </div>
                            <div className='check_list'>
                                <div className='check_list_title'>
                                    <span>Чек-лист</span>
                                    <button><Add/></button>
                                </div>
                                <div className='list_view'>
                                    <div className='check_list_elements'>
                                        <input type="checkbox"/>
                                        <p className='check_list_text2'>Пункт 1</p>
                                    </div>
                                    <div className='check_list_elements'>
                                        <input type="checkbox"/>
                                        <p className='check_list_text2'>Пункт 2</p>
                                    </div>
                                    <div className='check_list_elements'>
                                        <input type="checkbox"/>
                                        <p className='check_list_text2'>Пункт 3</p>
                                    </div>
                                    <div className='check_list_elements'>
                                        <input type="checkbox"/>
                                        <p className='check_list_text2'>Пункт 4</p>
                                    </div>
                                    <div className='check_list_elements'>
                                        <input type="checkbox"/>
                                        <p className='check_list_text2'>Пункт 5</p>
                                    </div>
                                    <div className='check_list_elements'>
                                        <input type="checkbox"/>
                                        <p className='check_list_text2'>Пункт 6</p>
                                    </div>
                                </div>
                            </div>
                            <div className='timer'>
                                <div className='timer_top'>
                                    <span>Таймер</span>
                                    <div className='timer_top_elements'>
                                        <p><Clock/>00:00:00</p>
                                        <div className='timer_button'>
                                            <button className='play_time' name="play"><Play/></button>
                                            <button className='save_time' name="save_time">Сохранить</button>
                                            <button className='remove_time' name="remove_time"><TrashWhite/></button>
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
                                <input className='create_view' type="button" name="create_task" value="Создать подзадачу"/>
                                <input className='remove_view' type="button" name="delete" value="Удалить задачу"/>
                            </div>
                            <div className='comments'>
                                <div className='comments_input'>
                                    <span>Комментарии</span>
                                    <input type="text" placeholder='Введите комментарий...'/>
                                </div>
                                <div className='comments_output'>
                                    <div className='comments_output_title'>
                                        <p className='comments_output_name'>Фамилия Имя Отчество</p>
                                        <p className='comments_output_time'>00:00</p>
                                    </div>
                                    <p className='comments_output_text'>Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                                        aliqua. Ut enim ad minim veniam, quis nostrud exercitation</p>
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
                {/*<div id="edit_task" className="modal" style={{display: "none"}}>*/}
                {/*    <div className="edit-form">*/}
                {/*        <div className='main'>*/}
                {/*            <div className="title">*/}
                {/*                <input*/}
                {/*                    placeholder='Введите название'*/}
                {/*                    type="text"*/}
                {/*                    name="text"*/}
                {/*                    className='create_title'*/}
                {/*                />*/}
                {/*                <p id='parent_task'></p>*/}
                {/*            </div>*/}
                {/*            <div className="project">*/}
                {/*                <span>Проект</span>*/}
                {/*                <select>*/}
                {/*                    <option>Название проекта</option>*/}
                {/*                    <option>ЛК Гант</option>*/}
                {/*                    <option>ЛК Канбан</option>*/}
                {/*                </select>*/}
                {/*            </div>*/}
                {/*            <div className='elements'>*/}
                {/*                <div className="element">*/}
                {/*                    <span>Дедлайн</span>*/}
                {/*                    <input type="date" name='deadline'/>*/}
                {/*                </div>*/}
                {/*                <div className="element">*/}
                {/*                    <span>Тег команды</span>*/}
                {/*                    <select>*/}
                {/*                        <option>#Тег_команды</option>*/}
                {/*                        <option>#Гант</option>*/}
                {/*                        <option>#Канбан</option>*/}
                {/*                    </select>*/}
                {/*                </div>*/}
                {/*                <div className="date">*/}
                {/*                    <span>Планируемые сроки выполнения</span>*/}
                {/*                    <div className='dateList'>*/}
                {/*                        <input type="date" name='start_date'/>*/}
                {/*                        -*/}
                {/*                        <input type="date" name='end_date'/>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*            <div className="description">*/}
                {/*                <p><textarea name="description" placeholder='Введите описание задачи...'></textarea></p>*/}
                {/*            </div>*/}
                {/*            <div className="name">*/}
                {/*                <div className='nameList'>*/}
                {/*                    <span>Постановщик</span>*/}
                {/*                    <input type="text" placeholder='Введите Имя'/>*/}
                {/*                </div>*/}
                {/*                <div className='nameList'>*/}
                {/*                    <span>Ответственный</span>*/}
                {/*                    <select>*/}
                {/*                        <option>Выберите</option>*/}
                {/*                        <option>Игорь</option>*/}
                {/*                        <option>Саша</option>*/}
                {/*                        <option>Вера</option>*/}
                {/*                        <option>Юля</option>*/}
                {/*                        <option>Артем</option>*/}
                {/*                    </select>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*            <div className='performers'>*/}
                {/*                <div className='performers_title'>*/}
                {/*                    <span>Исполнители</span>*/}
                {/*                    <button><Add/></button>*/}
                {/*                </div>*/}
                {/*                <div>*/}
                {/*                    <select>*/}
                {/*                        <option>Выберите</option>*/}
                {/*                        <option>Игорь</option>*/}
                {/*                        <option>Саша</option>*/}
                {/*                        <option>Вера</option>*/}
                {/*                        <option>Юля</option>*/}
                {/*                        <option>Артем</option>*/}
                {/*                    </select>*/}
                {/*                    <button><Del/></button>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*            <div className='check_list'>*/}
                {/*                <div className='check_list_title'>*/}
                {/*                    <span>Чек-лист</span>*/}
                {/*                    <button><Add/></button>*/}
                {/*                </div>*/}
                {/*                <div className='list'>*/}
                {/*                    <div className='check_list_elements'>*/}
                {/*                        <input type="checkbox"/>*/}
                {/*                        <input type="text" className='check_list_text' value='Пункт 1'/>*/}
                {/*                        <button><Del/></button>*/}
                {/*                    </div>*/}
                {/*                    <div className='check_list_elements'>*/}
                {/*                        <input type="checkbox"/>*/}
                {/*                        <input type="text" className='check_list_text' value='Пункт 2'/>*/}
                {/*                        <button><Del/></button>*/}
                {/*                    </div>*/}
                {/*                    <div className='check_list_elements'>*/}
                {/*                        <input type="checkbox"/>*/}
                {/*                        <input type="text" className='check_list_text' value='Пункт 3'/>*/}
                {/*                        <button><Del/></button>*/}
                {/*                    </div>*/}
                {/*                    <div className='check_list_elements'>*/}
                {/*                        <input type="checkbox"/>*/}
                {/*                        <input type="text" className='check_list_text' value='Пункт 4'/>*/}
                {/*                        <button><Del/></button>*/}
                {/*                    </div>*/}
                {/*                    <div className='check_list_elements'>*/}
                {/*                        <input type="checkbox"/>*/}
                {/*                        <input type="text" className='check_list_text' value='Пункт 5'/>*/}
                {/*                        <button><Del/></button>*/}
                {/*                    </div>*/}
                {/*                    <div className='check_list_elements'>*/}
                {/*                        <input type="checkbox"/>*/}
                {/*                        <input type="text" className='check_list_text' value='Пункт 6'/>*/}
                {/*                        <button><Del/></button>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*                <div className='timer_bottom'>*/}
                {/*                    <span>Затраченное время</span>*/}
                {/*                    <div className='timer_bottom_elements'>*/}
                {/*                        <p>00:00:00</p>*/}
                {/*                        <input type="text" placeholder='ФИО' readOnly={true}/>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*            <div className='timer_bottom'>*/}
                {/*                <span>Затраченное время</span>*/}
                {/*                <div className='timer_bottom_elements'>*/}
                {/*                    <p>00:00:00</p>*/}
                {/*                    <input type="text" placeholder='ФИО' readOnly={true}/>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*            <div className='buttons'>*/}
                {/*                <input className='edit_view' type="button" name="save_edit" value="Сохранить"/>*/}
                {/*                <input className='create_view' type="button" name="create_task" value="Создать подзадачу"/>*/}
                {/*                <input className='remove_view' type="button" name="delete" value="Удалить задачу"/>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*        <div className='closeButton'>*/}
                {/*            <button type='closemodal' className='closemodal'><Exit/></button>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
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
