import React from 'react';
import TaskRow from './TaskRow/TaskRow';
import s from './GanttTable.module.css';
import GanttTaskRow from './GanttTaskRow/GanttTaskRow';

const GanttTable = ({
                        tasks,
                        indentLevel = 0,
                        collapsedTasks,
                        toggleTaskCollapse,
                    }) => {
    const allStartDates = tasks.map((task) => task.startDate);
    const allEndDates = tasks.map((task) => task.endDate);

    const earliestDate = new Date(Math.min(...allStartDates));
    const latestDate = new Date(Math.max(...allEndDates));

    const projectDurationInDays =
        (latestDate.getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24);

    const dateArray = [...Array(projectDurationInDays)].map((_, i) => {
        const currentDate = new Date(earliestDate);
        currentDate.setDate(currentDate.getDate() + i);
        return currentDate;
    });

    return (
        <div className={s.container}>
            <div className={s.table}>
                <table>
                    <thead>
                    <tr>
                        <th>Name</th>
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
            </div>

            <div className={s.row}>
                <div className={s.tableWrapper}>
                    <table>
                        <thead>
                        <tr>
                            {dateArray.map((date, index) => (
                                <th key={index}>{date.toLocaleDateString()}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {tasks.map((task) => (
                            <GanttTaskRow
                                key={task.id}
                                task={task}
                                projectDurationInDays={projectDurationInDays}
                                collapsedTasks={collapsedTasks}
                                toggleTaskCollapse={toggleTaskCollapse}
                            />
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default GanttTable;
