import React from 'react';
import TaskRow from "./TaskRow/TaskRow";
import s from './GanttTable.module.css';

const GanttTable = ({ tasks, indentLevel = 0, collapsedTasks, toggleTaskCollapse }) => {
    return (
        <table className={s.container}>
            <thead>
            <tr>
                <th>Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Duration</th>
                <th>Progress</th>
            </tr>
            </thead>
            <tbody>
            {tasks.map((task) => (
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
    );
};

export default GanttTable;
