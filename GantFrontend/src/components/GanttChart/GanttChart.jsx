import React, { useState } from 'react';
import s from './GanttChart.module.css';
import GanttTable from './GanttTable/GanttTable';

const GanttChart = () => {
    const [tasks, setTasks] = useState([
        {
            id: 1,
            name: 'Task 1',
            startDate: new Date('2023-06-15'),
            endDate: new Date('2023-07-27'),
            children: [
                {
                    id: 2,
                    name: 'Subtask 1.1',
                    startDate: new Date('2023-06-15'),
                    endDate: new Date('2023-06-22'),
                    children: [
                        {
                            id: 3,
                            name: 'Subtask 1.2',
                            startDate: new Date('2023-06-12'),
                            endDate: new Date('2023-06-15'),
                            children: [
                                {
                                    id: 4,
                                    name: 'Subtask 1.1.1',
                                    startDate: new Date('2023-06-17'),
                                    endDate: new Date('2023-06-20'),
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: 5,
            name: 'Task 2',
            startDate: new Date('2023-07-18'),
            endDate: new Date('2023-08-30'),
        }
    ]);


    const [collapsedTasks, setCollapsedTasks] = useState([]);

    const toggleTaskCollapse = (taskId) => {
        setCollapsedTasks((prevCollapsedTasks) => {
            if (prevCollapsedTasks.includes(taskId)) {
                return prevCollapsedTasks.filter((id) => id !== taskId);
            } else {
                return [...prevCollapsedTasks, taskId];
            }
        });
    };

    return (
        <div className={s.container}>
            <GanttTable
                tasks={tasks}
                collapsedTasks={collapsedTasks}
                toggleTaskCollapse={toggleTaskCollapse}
            />
        </div>
    );
};

export default GanttChart;
