import React, {Component} from 'react';
import axios from 'axios';
import './Gantt.css'
import {gantt} from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import s from "../Main/Main.module.css";


export default class Gantt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    componentDidMount() {
        gantt.config.date_format = "%Y-%m-%d";

        gantt.config.scales = [
            {unit: "month", step: 1, format: "%F, %Y"},
            {unit: "day", step: 1, format: "%j, %D"}
        ];

        gantt.config.scale_height = 80;

        gantt.init(this.ganttContainer);


        gantt.config.columns = [
            {name: "text", label: "ЗАДАЧИ", width: "*", tree: true},
            {name:"checked", label:"",width: "20", template:function(task) {
                    if (task.children === 0) {
                        return "<input type='checkbox' name='test' id='test' checked={task.checked} value='1'>";
                    }
                }
            },
            {name: "add", label: "", width: "44"},
        ];

        gantt.config.lightbox.sections = [
            {name: "text", height: 22, map_to: "text", type: "textarea", focus: true},
            {name: "description", height: 70, map_to: "description", type: "textarea"},
            {name: "time", height: 72, type: "time", map_to: "auto"},
        ];

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

        gantt.templates.grid_open = function(item) {
            return "<div class='gantt_tree_icon gantt_" +
                (item.$open ? "close" : "open") + "'></div>";
        };


        axios.get('http://localhost:8000/api/v1/gant/tasks')
            .then(response => {
                const transformedData = this.transformData(response.data);
                gantt.parse(transformedData);

            })
            .catch(error => {
                console.error(error);
            });

    }

    addTask() {
        gantt.createTask(() => {
            const newTask = {
                name: "Новая задача",
                planned_start_date: gantt.getState().min_date,
                planned_finish_date: gantt.getState().max_date,
                description: "",
                is_on_kanban: false,
                parent_id: null,
                checked: false,
                children: 0
            };

            axios.post('http://localhost:8000/api/v1/gant/task/create', newTask)
                .then((response) => {
                    newTask.id = response.data.id;
                    gantt.addTask(newTask, 0);
                    gantt.showLightbox(newTask.id);
                })
                .catch((error) => {
                    console.error(error);
                });
        });
    }



    transformData(data) {
        const taskMap = new Map();

        function transformTask(task, parentId = 0) {
            const taskId = task.id;

            taskMap.set(taskId, {
                id: taskId,
                text: task.name,
                start_date: task.planned_start_date,
                end_date: task.planned_finish_date,
                open: true,
                parent: parentId,
                description: task.description,
                checked: task.is_on_kanban,
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
    }


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
                        <button onClick={() => this.addTask()}>Создать Задачу</button>
                    </div>
                </div>
                <div
                    ref={(input) => {
                        this.ganttContainer = input
                    }}
                    style={{width: '90%', height: '90%'}}
                ></div>
            </>
        );
    }
}
