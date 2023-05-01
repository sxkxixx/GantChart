import React, {Component} from 'react';
import axios from 'axios';
import './Gantt.css'
import {gantt} from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import s from "../Main/Main.module.css";
import {ReactComponent as Exit} from "../../Assets/img/exitmodal.svg"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { onKanbanViewChange } from './onJanban';


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
        gantt.config.scales = [
            {unit: "month", step: 1, format: "%F, %Y"},
            {unit: "day", step: 1, format: "%j"}
        ];

        // Колоны
        gantt.config.columns = [
            {name: "text", label: "ЗАДАЧИ", width: "*", tree: true},
            {
                name: "checked", label: "", width: "20", template: function (task) {
                    if (task.children === 0) {
                        return `<input type='checkbox' ${task.is_on_kanban ? "checked" : ""} onchange='onKanbanViewChange(${task.id}, !${task.is_on_kanban})'>`;
                    }
                }
            },
            {
                name: "add", label: "", width: 44, template: function (task) {
                    return "<div onclick='(" + task.id + ")';>&nbsp;&nbsp;&nbsp;+&nbsp;&nbsp;</div>"
                }
            }
        ];

        gantt.showLightbox = function (id) {
            taskId = id;
            const task = gantt.getTask(id);

            let form = getForm();

            // вывод данных
            form.querySelector("[id='parent_task']").value = task.parent || '';
            let text = form.querySelector("[name='text']");
            let description = form.querySelector("[name='description']");
            let deadline = form.querySelector("[name='deadline']");
            let startDate = form.querySelector("[name='start_date']");
            let endDate = form.querySelector("[name='end_date']");

            description.focus();
            text.focus();
            deadline.focus();
            startDate.focus();
            endDate.focus();

            if (task.parent) {
                const parentTask = gantt.getTask(task.parent);
                form.querySelector("#parent_task").innerHTML = "Базовая задача: " + parentTask.text;
            } else {
                form.querySelector("#parent_task").innerHTML = "";
            }

            description.value = task.description || "";
            text.value = task.text || "";
            deadline.value = task.deadline ? new Date(task.deadline).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
            startDate.value = task.start_date ? new Date(task.start_date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
            endDate.value = task.end_date ? new Date(task.end_date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);

            if (task.$new) {
                // Добавляем стартовые значения для дедлайна, начальной и конечной дат
                deadline.value = "";
                startDate.value = "";
                endDate.value = "";
            }

            form.style.display = "flex";

            form.querySelector("[name='save']").onclick = save;
            form.querySelector("[name='close']").onclick = cancel;
            form.querySelector("[name='delete']").onclick = remove;
            form.querySelector('button[type="closemodal"]').onclick = cancel;
        };

        gantt.hideLightbox = function () {
            getForm().style.display = "none";
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

        gantt.attachEvent("onBeforeTaskDrag", function(id, mode, e){
            return true;
        });

        gantt.attachEvent("onAfterTaskDrag", function(id, mode, e){
            let task = gantt.getTask(id);

            axios.post(`http://localhost:8000/api/v1/gant/task/${id}/edit_dates`, { planned_start_date: new Date(task.start_date).toISOString().slice(0, 10), planned_finish_date: new Date(task.end_date).toISOString().slice(0, 10), deadline: task.deadline })
                .then(response => {
                    console.log(response.data);
                })
                .catch(error => {
                    console.error(error);
                });
        });

        function getForm() {
            return document.getElementById("my-form");
        }

        function save() {
            const form = getForm();

            // Получаем значения полей формы
            const parentId = form.querySelector("[id='parent_task']").value
            const text = form.querySelector("[name='text']").value.trim();
            const description = form.querySelector("[name='description']").value.trim();
            const deadline = form.querySelector("[name='deadline']").value;
            const start_date = form.querySelector("[name='start_date']").value;
            const end_date = form.querySelector("[name='end_date']").value;

            // Валидация полей формы
            if (!text) {
                toast.success("Введите название задачи",{
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

            if (!start_date || !end_date) {
                toast.success("Введите даты начала и конца задачи",{
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

            if (new Date(start_date).getTime() > new Date(end_date).getTime()) {
                toast.success("Дата начала не может быть позже даты окончания задачии",{
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
                // Скрываем форму
                form.style.display = "none";
                // Обновляем Gantt Chart с новыми данными
                console.log(response.data);
                toast.success("Задача создана",{
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
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
                {/*==================================================*/}
                <div id="my-form" className="modal" style={{display: "none"}}>
                    <div className="my-form">
                        <div className='main'>
                            <div className="title">
                                <input
                                    placeholder='Введите название'
                                    type="text"
                                    name="text"
                                />
                                <p id='parent_task'></p>
                            </div>
                            <div className="project">
                                <span>Проект</span>
                                <input type="text" placeholder='Название проекта'/>
                            </div>
                            <div className='elements'>
                                <div className="element">
                                    <span>Дедлайн</span>
                                    <input type="date" name='deadline'/>
                                </div>
                                <div className="element">
                                    <span>Тег команды</span>
                                    <input type="text" placeholder='Тег'/>
                                </div>
                                <div className="date">
                                    <span>Планируемые сроки выполнения</span>
                                    <div className='dateList'>
                                        <input type="date" name='start_date'/> - <input type="date" name='end_date'/>
                                    </div>
                                </div>
                            </div>
                            <div className="description">
                                <p><textarea name="description" placeholder='Введите описание задачи...'></textarea></p>
                            </div>
                            <div className="name">
                                <div className='nameList'>
                                    <span>Постановщик</span>
                                    <input type="text" placeholder='ФИО'/>
                                </div>
                                <div className='nameList'>
                                    <span>Ответственный</span>
                                    <input type="text" placeholder='ФИО'/>
                                </div>
                            </div>
                            <div className='performers'>
                                <span>Исполнители</span>
                                <input type="text" placeholder='ФИО'/>
                            </div>
                            <div className='check_list'>
                                <span>Чек-лист</span>
                                <div className='check_list_elements'>
                                    <input type="checkbox"/>
                                    <input type="text" className='check_list_text'/>
                                </div>
                            </div>
                            <div className='buttons'>
                                <input className='save' type="button" name="save" value="Сохранить"/>
                                <input className='cancel' type="button" name="close" value="Отменить"/>
                                <input className='cancel' type="button" name="delete" value="Удалить"/>
                            </div>
                        </div>
                        <div className='closeButton'>
                            <button type='closemodal' className='closemodal'><Exit/></button>
                        </div>
                    </div>
                </div>
                {/*===================================================*/}
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
