import React, {useEffect, useState} from 'react';
import s from './GanttChart.module.css';
import GanttTable from './GanttTable/GanttTable';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {tasksState} from '../../store/atom';
import {getAllTask} from '../../services/task';

const GanttChart = () => {
    const [collapsedTasks, setCollapsedTasks] = useState([]);

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
