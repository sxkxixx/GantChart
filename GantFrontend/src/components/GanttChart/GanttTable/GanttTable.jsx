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
        Math.ceil((latestDate.getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const startDate = new Date(earliestDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + projectDurationInDays - 1);

    const dateArray = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        dateArray.push(new Date(d));
    }

    const groupedDates = dateArray.reduce((acc, date) => {
        const monthString = date.toLocaleString('default', { month: 'long' });
        acc[monthString] = acc[monthString] || [];
        acc[monthString].push(date);
        return acc;
    }, {});

    const monthArrays = Object.keys(groupedDates).map(
        (month) => groupedDates[month]
    );

    return (
        <div className={s.container}>
            <div className={s.table}>
                <table>
                    <thead>
                    <tr>
                        <th>Задачи</th>
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
                            {monthArrays.map((monthArray, index) => (
                                <th colSpan={monthArray.length} key={index}>
                                    {monthArray[0].toLocaleString('default', { month: 'long' })}{' '}
                                    {monthArray[0].getFullYear()}
                                </th>
                            ))}
                        </tr>
                        <tr>
                            {dateArray.map((date, index) => (
                                <th key={index} colSpan="1" style={{ width: '30px' }}>
                                    {date.getDate()}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {tasks.map((task) => (
                            <GanttTaskRow
                                key={task.id}
                                task={task}
                                projectDurationInDays={projectDurationInDays}
                                startDate={startDate}
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
