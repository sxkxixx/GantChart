import React, {useEffect, useState} from 'react';
import s from './GanttChart.module.css';
import GanttTable from './GanttTable/GanttTable';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {tasksState} from '../../store/atom';
import {getAllTask} from '../../services/task';

const GanttChart = () => {
    const [collapsedTasks, setCollapsedTasks] = useState([]);
    // const [tasks, setTasks] = useState([
    //     {
    //         id: 1,
    //         name: 'Task 1',
    //         startDate: new Date('2023-06-15'),
    //         endDate: new Date('2023-07-27'),
    //         children: [
    //             {
    //                 id: 2,
    //                 name: 'Subtask 1.1',
    //                 startDate: new Date('2023-06-15'),
    //                 endDate: new Date('2023-06-22'),
    //                 children: [
    //                     {
    //                         id: 3,
    //                         name: 'Subtask 1.1.1',
    //                         startDate: new Date('2023-06-16'),
    //                         endDate: new Date('2023-06-18'),
    //                         children: [
    //                             {
    //                                 id: 4,
    //                                 name: 'Subtask 1.1.1.1',
    //                                 startDate: new Date('2023-06-17'),
    //                                 endDate: new Date('2023-06-20'),
    //                             },
    //                         ],
    //                     },
    //                 ],
    //             },
    //             {
    //                 id: 6,
    //                 name: 'Subtask 1.2',
    //                 startDate: new Date('2023-06-17'),
    //                 endDate: new Date('2023-06-20'),
    //             }
    //         ],
    //     },
    //     {
    //         id: 5,
    //         name: 'Task 2',
    //         startDate: new Date('2023-06-12'),
    //         endDate: new Date('2023-06-14'),
    //     }
    // ]);

    const tasks = useRecoilValue(tasksState);
    const setTasks = useSetRecoilState(tasksState);

    useEffect(() => {
        getAllTask()
            .then((response) => {
                setTasks(response);
                console.log(response)
            })
            .catch((error) => {
                console.log(error);
            });
    }, [setTasks]);


    const toggleTaskCollapse = (taskId) => {
        setCollapsedTasks((prevCollapsedTasks) =>
            prevCollapsedTasks.includes(taskId)
                ? prevCollapsedTasks.filter((id) => id !== taskId)
                : [...prevCollapsedTasks, taskId]
        );
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
