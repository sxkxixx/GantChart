import React from 'react';
import s from './GanttTaskRow.module.css';

const GanttTaskRow = ({ task, projectDurationInDays, toggleTaskCollapse, collapsedTasks, indentLevel = 0 }) => {
    const { id, startDate, endDate, children } = task;

    const isCollapsed = collapsedTasks.includes(id);

    let currentIndentLevel = indentLevel;

    if (children && !isCollapsed) {
        currentIndentLevel++;
    }

    const getCellStyle = (date) => {
        if (date >= startDate && date <= endDate) {
            return s.cellActive;
        } else {
            return s.cell;
        }
    };

    const handleCollapseToggle = () => {
        toggleTaskCollapse(id);
    };

    const allDates = [];

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        allDates.push(new Date(d));
    }

    const daysFromProjectStart = Math.ceil((startDate.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
    const paddingLeft = `${daysFromProjectStart * (100 / projectDurationInDays)}%`;

    return (
        <>
            <tr style={{ paddingLeft: paddingLeft }}
                key={id}
                onClick={handleCollapseToggle}
            >
                {allDates.map((date, index) => {
                    const dateCellStyle = getCellStyle(date);

                    return (
                        <td
                            key={`${id}-${index}`}
                            colSpan="1"
                            className={dateCellStyle}
                        ></td>
                    );
                })}
            </tr>
            {children && !isCollapsed && children.map((childTask) => (
                <GanttTaskRow
                    key={childTask.id}
                    task={childTask}
                    projectDurationInDays={projectDurationInDays}
                    collapsedTasks={collapsedTasks}
                    toggleTaskCollapse={toggleTaskCollapse}
                    indentLevel={currentIndentLevel}
                />
            ))}
        </>
    );
};

export default GanttTaskRow;
