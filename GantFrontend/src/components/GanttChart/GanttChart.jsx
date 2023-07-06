import React, {useEffect, useState} from 'react';
import s from './GanttChart.module.css';
import GanttTable from './GanttTable/GanttTable';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {tasksState} from '../../store/atom';
import {getAllTask} from '../../services/task';
import TasksZero from "./TasksZero/TasksZero";
import {getItem, setItem} from "../../utils/storage";

const GanttChart = () => {
    const [collapsedTasks, setCollapsedTasks] = useState([]);

    const tasks = useRecoilValue(tasksState);
    const setTasks = useSetRecoilState(tasksState);

    useEffect(() => {
        getAllTask()
            .then((response) => {
                setTasks(response);
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

    if (tasks.length === 0) {
        return <TasksZero />
    }

    return (
        <div className={s.container}>
            <GanttTable
                tasks={tasks}
                collapsedTasks={collapsedTasks}
                toggleTaskCollapse={toggleTaskCollapse}
                setTasks={setTasks}
            />
        </div>
    );
};

export default GanttChart;
