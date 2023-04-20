import React, { Component } from 'react';
import axios from 'axios';
import './Gantt.css'
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';



export default class Gantt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    componentDidMount() {
        gantt.config.date_format = "%Y-%m-%d %H:%i";
        gantt.config.scales = [
            {unit: "month", step: 1, format: "%F, %Y"},
            {unit: "day", step: 1, format: "%j, %D"}
        ];
        gantt.config.scale_height = 80;
        gantt.init(this.ganttContainer);
        gantt.config.columns = [
            {name: "text", label: "Задачи", width: "*", tree: true},
            {name: "add", label: "", width: "44"},
        ];
        gantt.config.lightbox.sections = [
            { name: "text", height: 22, map_to: "text", type: "textarea", focus: true },
            { name: "description", height: 70, map_to: "description", type: "textarea" },
            { name: "time", height: 72, type: "time", map_to: "auto" },
        ];

        gantt.templates.task_class = function(start, end, task) {
            if (task.$level === 0) {
                return "parent-task";
            } else if (task.$level === 1) {
                return "child-task";
            } else {
                return "grandchild-task"
            }
        }

        gantt.templates.grid_header_class = function(column) {
            if (column.name === "add") {
                return "hidden";
            } else {
                return "";
            }
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

    transformData(data) {
        const taskMap = new Map();

        function transformTask(task, parentId = 0) {
            const taskId = task.id;

            taskMap.set(taskId, {
                id: taskId,
                text: task.name,
                start_date: task.planned_start_date,
                end_date: task.planned_finish_date,
                progress: 0,
                open: true,
                parent: parentId,
                description: task.description,
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
            <div
                ref={(input) => { this.ganttContainer = input }}
                style={{ width: '1720px', height: '90%' }}
            ></div>
        );
    }
}
