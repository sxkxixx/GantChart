import React, {Component} from 'react';
import axios from 'axios';
import './Gantt.css'
import {gantt} from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import s from "../Main/Main.module.css";
import {ReactComponent as Exit} from "../../Assets/img/exitmodal.svg"


let taskId = null;
let toggle = false;

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
            {name:"checked", label:"",width: "20", template:function(task) {
                    if (task.children === 0) {
                        return "<input type='checkbox' name='test' id='test' checked={task.is_on_kanban} value='1'>";
                    }
                }
            },
            {name:"add", label:"", width:44,template: function (task){
                    return "<div onclick='custom_add("+task.id+")';>&nbsp;&nbsp;&nbsp;+&nbsp;&nbsp;</div>"}}
        ];

        // Кастомная форма
        function custom_add(id){
            gantt.hideLightbox();
            toggle = true;
            let new_id = +new Date()
            gantt.createTask({id: new_id, start_date:gantt.getState().min_date},id,1);

        }

        gantt.showLightbox = function(id) {
            taskId = id;
            const task = gantt.getTask(id);

            let form = getForm();

            //вывод данных
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

            description.value = task.description || "Введите описание задачи... ";
            text.value = task.text || "Название задачи";
            deadline.value = task.deadline ? task.deadline : new Date();
            startDate.value = task.start_date ? new Date(task.start_date).toISOString().substr(0, 10) : new Date().toISOString().substr(0, 10);
            endDate.value = task.end_date ? new Date(task.end_date).toISOString().substr(0, 10) : new Date().toISOString().substr(0, 10);

            form.style.display = "flex";

            form.querySelector("[name='save']").onclick = save;
            form.querySelector("[name='close']").onclick = cancel;
            form.querySelector("[name='delete']").onclick = remove;
            form.querySelector('button[type="closemodal"]').onclick = cancel;
        };


        gantt.hideLightbox = function(){
            getForm().style.display = "none";
            taskId = null;
        }

        gantt.config.open_tree_initially = true;

        // Изменение отображения элементов на Диаграмме

        gantt.templates.grid_file = function(obj){
            if(obj.$level === 0)
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

        gantt.templates.task_text=function(start, end, task){
            if (task.text){
             return ''
            }
        };

        gantt.templates.task_class = function (start, end, task) {
            if (task.$level === 0 || task.$level === 1 ) {
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

        function getForm() {
            return document.getElementById("my-form");
        }

        function save() {
            const task = gantt.getTask(taskId);
            const form = getForm();

            task.text = form.querySelector("[name='text']").value;
            task.description = form.querySelector("[name='description']").value;
            task.deadline = form.querySelector("[name='deadline']").value;
            task.start_date = form.querySelector("[name='start_date']").value;
            task.end_date = form.querySelector("[name='end_date']").value;

            const createTaskUrl = '/api/v1/gant/task/create';
            const requestBody = {
                parent_id: task.parent,
                project_id: 0,
                team_id: 0,
                name: task.text,
                description: task.description,
                planned_start_date: task.start_date,
                planned_finish_date: task.end_date,
                deadline: task.deadline
            };

            axios.post(createTaskUrl, requestBody)
                .then(response => {
                    const newTaskId = response.data.id;
                    task.id = newTaskId;

                    if (task.$new) {
                        delete task.$new;
                        gantt.addTask(task, task.parent);
                    } else {
                        gantt.updateTask(task.id);
                    }

                    gantt.hideLightbox();
                })
                .catch(error => {
                    console.error(error);
                });
        }





        function cancel() {
            let task = gantt.getTask(taskId);

            if(task.$new)
                gantt.deleteTask(task.id);
            gantt.hideLightbox();
        }

        function remove() {
            gantt.deleteTask(taskId);
            gantt.hideLightbox();
        }
    }

    createTask = (task) => {
        axios.post('/api/v1/gant/task/create', task)
            .then(response => {
                console.log('Task created:', response.data);
                gantt.addTask(task);
                gantt.hideLightbox();
            })
            .catch(error => {
                console.error('Failed to create task:', error);
            });
    };
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
                    <div className="my-form" >
                        <div className='main'>
                            <div className="title">
                                <input
                                    type="text"
                                    name="text"
                                />
                                <p id='parent_task'></p>
                            </div>
                            <div className="project">
                                <span>Проект</span>
                                <input type="text"/>
                            </div>
                            <div className='elements'>
                                <div className="element">
                                    <span>Дедлайн</span>
                                    <input type="date" name='deadline'/>
                                </div>
                                <div className="element">
                                    <span>Тег команды</span>
                                    <input type="text"/>
                                </div>
                                <div className="date">
                                    <span>Планируемые сроки выполнения</span>
                                    <div className='dateList'>
                                        <p><input type="date" name='start_date'/> - <input type="date" name='end_date'/></p>
                                    </div>
                                </div>
                            </div>
                            <div className="description">
                                <p><textarea name="description"></textarea></p>
                            </div>
                            <div className="name">
                                <div className='nameList'>
                                    <span>Постановщик</span>
                                    <input type="text"/>
                                </div>
                                <div className='nameList'>
                                    <span>Ответственный</span>
                                    <input type="text"/>
                                </div>
                            </div>
                            <div className='performers'>
                                <span>Исполнители</span>
                                <input type="text"/>
                            </div>
                            <div className='check_list'>
                                <span>Чек-лист</span>
                                <div className='check_list_elements'>
                                    <input type="checkbox"/>
                                    <input type="text" className='check_list_text'/>
                                </div>
                                <div className='check_list_elements'>
                                    <input type="checkbox"/>
                                    <input type="text" className='check_list_text'/>
                                </div>
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
                            <button type='closemodal'><Exit/></button>
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
