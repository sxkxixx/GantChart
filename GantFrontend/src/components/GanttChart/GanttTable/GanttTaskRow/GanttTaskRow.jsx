import React from 'react';
import s from './GanttTaskRow.module.css';

const GanttTaskRow = ({
                          task,
                          projectDurationInDays,
                          startDate,
                          collapsedTasks,
                          indentLevel = 0,
                      }) => {
    const { id, startDate: taskStartDate, endDate: taskEndDate, children } = task;

    const isCollapsed = collapsedTasks.includes(id);

    let currentIndentLevel = indentLevel;

    if (children && !isCollapsed) {
        currentIndentLevel++;
    }

    const allDates = [];
    const startIndex = Math.round((taskStartDate - startDate) / (1000 * 60 * 60 * 24));
    const endIndex = Math.round((taskEndDate - startDate) / (1000 * 60 * 60 * 24));

    for (let i = 0; i < projectDurationInDays; i++) {
        if (i >= startIndex && i <= endIndex) {
            allDates.push(new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000));
        } else {
            allDates.push(null);
        }
    }

    const getCellStyle = (dateIndex) => {
        if (taskStartDate && taskEndDate) {
            if (dateIndex >= startIndex && dateIndex <= endIndex) {
                return s.cellActive;
            }
        }
        return null;
    };

    const dateCells = [];
    let currentStyle = null;
    let currentColSpan = 0;
    for (let i = 0; i < allDates.length; i++) {
        const date = allDates[i];
        const style = getCellStyle(i);
        if (style !== currentStyle || date === null) {
            if (currentColSpan > 0) {
                dateCells.push(
                    <td
                        key={`${id}-${i - currentColSpan}`}
                        colSpan={currentColSpan}
                        className={`${currentStyle} ${
                            currentIndentLevel > 0 ? s.ganttCellIndent : ''
                        }`}
                    ></td>
                );
            }
            currentStyle = style;
            currentColSpan = 1;
        } else {
            currentColSpan++;
        }
    }
    if (currentColSpan > 0) {
        dateCells.push(
            <td
                key={`${id}-${allDates.length - currentColSpan}`}
                colSpan={currentColSpan}
                className={`${currentStyle} ${
                    currentIndentLevel > 0 ? s.ganttCellIndent : ''
                }`}
            ></td>
        );
    }

    return (
        <>
            <tr key={id}>{dateCells}</tr>
            {children &&
                !isCollapsed &&
                children.map((childTask) => (
                    <GanttTaskRow
                        key={childTask.id}
                        task={childTask}
                        projectDurationInDays={projectDurationInDays}
                        startDate={startDate}
                        collapsedTasks={collapsedTasks}
                        indentLevel={currentIndentLevel}
                    />
                ))}
        </>
    );
};

export default GanttTaskRow;
