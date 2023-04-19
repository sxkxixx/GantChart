import React, { Component } from 'react';
import axios from 'axios';
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
        gantt.init(this.ganttContainer);
        gantt.config.columns = [
            {name:"text", label:"Задачи", width:"*", tree:true},
            {name:"add", label:"", width:44}
        ];

        axios.get('http://localhost:8000/api/v1/gant/tasks')
            .then(response => {
                const transformedData = this.transformData(response.data);
                gantt.parse(transformedData);
            })
            .catch(error => {
                console.error(error);
            });
    }


    // transformData(data) {
    //     const transformedData = {
    //         data: [],
    //     };
    //
    //     const taskMap = new Map();
    //
    //     // Map through the top level tasks
    //     data.forEach((task) => {
    //         const taskId = task.id;
    //
    //         // Add the task to the task map with its children
    //         taskMap.set(taskId, {
    //             id: taskId,
    //             text: task.name,
    //             start_date: task.planned_start_date,
    //             end_date: task.planned_finish_date,
    //             progress: 0,
    //             open: true,
    //             parent: 0, // set parent as 0 for top-level tasks
    //         });
    //
    //         // Map through the children tasks
    //         task.children.forEach((child) => {
    //             const childId = child.id;
    //
    //             // Add the child task to the task map
    //             taskMap.set(childId, {
    //                 id: childId,
    //                 text: child.name,
    //                 start_date: child.planned_start_date,
    //                 end_date: child.planned_finish_date,
    //                 progress: 0,
    //                 open: true,
    //                 parent: taskId, // set the parent as the current top-level task
    //             });
    //         });
    //     });
    //
    //     // Add all the tasks from the task map to the transformed data array
    //     taskMap.forEach((task) => {
    //         transformedData.data.push(task);
    //     });
    //
    //     return transformedData;
    // }

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
                style={{ width: '80%', height: '600px' }}
            ></div>
        );
    }
}
