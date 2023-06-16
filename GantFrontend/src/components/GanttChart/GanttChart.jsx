import React, {useState} from "react";
import s from './GanttChart.module.css'
import GanttTable from "./GanttTable/GanttTable";
import GantTimeline from "./GanttTimeline/GantTimeline";

const GanttChart = () => {

    const tasks = [
        {
            id: 1,
            name: "Task 1",
            startDate: new Date("2023-06-15"),
            endDate: new Date("2023-06-30"),
            progress: 0.5,
            children: [
                {
                    id: 2,
                    name: "Subtask 1.1",
                    startDate: new Date("2023-06-15"),
                    endDate: new Date("2023-06-22"),
                    progress: 0.8,
                    children: [
                        {
                            id: 3,
                            name: "Subtask 1.1",
                            startDate: new Date("2023-06-15"),
                            endDate: new Date("2023-06-22"),
                            progress: 0.8,
                        },
                        {
                            id: 4,
                            name: "Subtask 1.2",
                            startDate: new Date("2023-06-23"),
                            endDate: new Date("2023-06-30"),
                            progress: 0.3,
                        },
                    ],
                },
                {
                    id: 5,
                    name: "Subtask 1.2",
                    startDate: new Date("2023-06-23"),
                    endDate: new Date("2023-06-30"),
                    progress: 0.3,
                },
            ],
        },
        {
            id: 6,
            name: "Task 2",
            startDate: new Date("2023-06-20"),
            endDate: new Date("2023-07-05"),
            progress: 0.2,
            children: [
                {
                    id: 7,
                    name: "Subtask 2.1",
                    startDate: new Date("2023-06-20"),
                    endDate: new Date("2023-06-25"),
                    progress: 0.6,
                },
                {
                    id: 8,
                    name: "Subtask 2.2",
                    startDate: new Date("2023-06-26"),
                    endDate: new Date("2023-07-01"),
                    progress: 0.4,
                },
                {
                    id: 9,
                    name: "Subtask 2.3",
                    startDate: new Date("2023-07-02"),
                    endDate: new Date("2023-07-05"),
                    progress: 0.1,
                },
            ],
        },
    ];

    const [collapsedTasks, setCollapsedTasks] = useState([]);

    const toggleTaskCollapse = (taskId) => {
        if (collapsedTasks.includes(taskId)) {
            setCollapsedTasks(collapsedTasks.filter((id) => id !== taskId));
        } else {
            setCollapsedTasks([...collapsedTasks, taskId]);
        }
    };


    return(
        <div className={s.container}>
            <GanttTable
                tasks={tasks}
                collapsedTasks={collapsedTasks}
                toggleTaskCollapse={toggleTaskCollapse}
            />
            <GantTimeline tasks={tasks}/>
        </div>
    )
}

export default GanttChart
