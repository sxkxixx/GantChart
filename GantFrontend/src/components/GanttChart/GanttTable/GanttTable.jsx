import React from 'react';
import TaskRow from './TaskRow/TaskRow';
import s from './GanttTable.module.css';
import styled from 'styled-components';

const Row = styled.tr`
  height: 30px;
`;

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
                    task.children.forEach((child) => {
                        if (!addedIds.has(child.id)) {
                            acc.push(...flattenTasks([child], addedIds, true));
                            if (child.children && child.children.length > 0 && !collapsedTasks.includes(child.id)) {
                                acc.push(...flattenTasks(child.children, addedIds, true));
                            }
                        }
                    });
                }
            }
            return acc;
        }, []);
    };


    const flattenedTasks = flattenTasks(tasks);

    const ganttRows = flattenedTasks.map((task) => {
        const daysFromStart = (task.startDate.getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24);
        const taskDurationInDays = (task.endDate.getTime() - task.startDate.getTime()) / (1000 * 60 * 60 * 24);
        const taskWidth = taskDurationInDays / projectDurationInDays * 100;

        let rowCells = [];

        for (let i = 0; i < daysFromStart; i++) {
            rowCells.push(<td key={`empty-cell-${i}`} className={s.cell}>&nbsp;</td>);
        }

        rowCells.push(
            <td
                key={`task-cell-${task.id}`}
                className={`${s.cell} ${s.task}`}
                style={{ width: `${taskWidth}%`, backgroundColor: task.color || '#4f8fff'}}
            >
                {task.name}
            </td>
        );

        return <Row key={`gantt-row-${task.id}`}>{rowCells}</Row>;
    });

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
                        {dateArray.map((date) => (
                            <th key={date}>{date.toLocaleDateString()}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className={s.rowTable}>
                    {ganttRows}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GanttTable;
