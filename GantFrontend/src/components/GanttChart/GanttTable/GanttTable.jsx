import React from 'react';
import TaskRow from "./TaskRow/TaskRow";
import s from './GanttTable.module.css';
import GanttRow from "../GanttRow/GanttRow";

const GanttTable = ({ tasks, indentLevel = 0, collapsedTasks, toggleTaskCollapse }) => {
    const allStartDates = tasks.map(task => task.startDate);
    const allEndDates = tasks.map(task => task.endDate);
    const earliestDate = new Date(Math.min(...allStartDates));
    const latestDate = new Date(Math.max(...allEndDates));

    const projectDurationInDays = (latestDate.getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24);

    return (
        <div className={s.container}>
            <div className={s.table}>
                <table>
                    <thead>
                    <tr>
                        <th>Name</th>
                    </tr>
                    </thead>
                    <tbody >
                    {tasks.map(task => (
                        <TaskRow
                            key={task.id}
                            task={task}
                            indentLevel={indentLevel}
                            collapsedTasks={collapsedTasks}
                            toggleTaskCollapse={toggleTaskCollapse}
                        />
                    ))}
                    </tbody>
                </table>
            </div>

            <div className={s.row}>
                <table className={s.rowBody}>
                    <thead>
                    <tr>
                        {[...Array(projectDurationInDays)].map((_, i) => {
                            const currentDate = new Date(earliestDate);
                            currentDate.setDate(currentDate.getDate() + i);
                            return <th key={i}>{currentDate.toLocaleDateString()}</th>;
                        })}
                    </tr>
                    </thead>
                    <tbody>
                    {tasks.map(task => (
                        <GanttRow
                            key={task.id}
                            task={task}
                            earliestDate={earliestDate}
                            projectDurationInDays={projectDurationInDays}
                            collapsedTasks={collapsedTasks}
                            toggleTaskCollapse={toggleTaskCollapse}
                        />
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
};

export default GanttTable;
