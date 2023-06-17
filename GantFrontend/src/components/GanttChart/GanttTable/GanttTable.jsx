import React from 'react';
import TaskRow from './TaskRow/TaskRow';
import s from './GanttTable.module.css';
import GanttRow from '../GanttRow/GanttRow';
import styled from 'styled-components';

const Row = styled.tr`
  height: 77px;
`;

const GanttTable = ({
                        tasks,
                        indentLevel = 0,
                        collapsedTasks,
                        toggleTaskCollapse,
                    }) => {
    // Get all start and end dates
    const allStartDates = tasks.map((task) => task.startDate);
    const allEndDates = tasks.map((task) => task.endDate);

    // Find earliest and latest date
    const earliestDate = new Date(Math.min(...allStartDates));
    const latestDate = new Date(Math.max(...allEndDates));

    // Calculate project duration in days
    const projectDurationInDays =
        (latestDate.getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24);

    // Generate an array of dates within the project duration
    const dateArray = [...Array(projectDurationInDays)].map((_, i) => {
        const currentDate = new Date(earliestDate);
        currentDate.setDate(currentDate.getDate() + i);
        return currentDate;
    });

    // Generate an array of months within the project duration
    const monthArray = [
        ...new Set(dateArray.map((date) => date.getMonth())),
    ];

    // Flatten the tasks hierarchy using recursion
    const flattenTasks = (tasks, addedIds = new Set(), isChild = false) => {
        return tasks.reduce((acc, task) => {
            if (!addedIds.has(task.id)) {
                acc.push(task);
                addedIds.add(task.id);
                if (
                    task.children &&
                    task.children.length > 0 &&
                    !collapsedTasks.includes(task.id) &&
                    !isChild
                ) {
                    task.children.forEach(child => {
                        if (!addedIds.has(child.id)) {
                            acc.push(...flattenTasks([child], addedIds, true));
                        }
                    });
                }
            }
            return acc;
        }, []);
    };



    const flattenedTasks = flattenTasks(tasks);

    return (
        <div className={s.container}>
            <div className={s.table}>
                <table>
                    <thead>
                    <Row>
                        <th>Name</th>
                    </Row>
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
                <table className={s.rowBody}>
                    <thead>
                    <tr>
                        {monthArray.map((month) => (
                            <th key={month} colSpan="30">
                                {dateArray
                                    .find((date) => date.getMonth() === month)
                                    ?.toLocaleString("default", { month: "long" })}
                            </th>
                        ))}
                    </tr>
                    <tr>
                        {dateArray.map((date) => (
                            <th key={date}>{date.toLocaleDateString()}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className={s.rowTable}>
                    {tasks.map(
                        (task) =>
                            task.startDate <= latestDate &&
                            task.endDate >= earliestDate && (
                                <GanttRow
                                    key={task.id}
                                    task={task}
                                    earliestDate={earliestDate}
                                    projectDurationInDays={projectDurationInDays}
                                    dateArray={dateArray}
                                />
                            )
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GanttTable;
