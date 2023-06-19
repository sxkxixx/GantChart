import React from 'react';
import s from './GanttTaskRow.module.css';

const GanttTaskRow = ({
                          task,
                          projectDurationInDays,
                          startDate,
                          collapsedTasks,
                          indentLevel = 0,
                      }) => {
    const { id, planned_start_date: taskStartDate, planned_final_date: taskEndDate, children } = task;

    const isCollapsed = collapsedTasks.includes(id);

    let currentIndentLevel = indentLevel;

    if (children && !isCollapsed) {
        currentIndentLevel++;
    }

    const allDates = [];
    const startIndex = Math.round(
        (new Date(taskStartDate) - startDate) / (1000 * 60 * 60 * 24)
    );
    const endIndex = Math.round(
        (new Date(taskEndDate) - startDate) / (1000 * 60 *60 * 24)
    );

    for (let i = 0; i < projectDurationInDays; i++) {
        if (i >= startIndex && i <= endIndex) {
            allDates.push(new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000));
        } else {
            allDates.push(null);
        }
    }

    const getCellStyle = (dateIndex) => {
        let colorClass = '';
        if (indentLevel === 0 || indentLevel === 1) {
            colorClass = s.cellColor1;
        } else {
            colorClass = s.cellColor2;
        }

        if (taskStartDate && taskEndDate) {
            if (dateIndex >= startIndex && dateIndex <= endIndex) {
                return `${s.cellActive} ${colorClass}`;
            }
        }

        return colorClass;
    };

    const dateCells = [];
    let currentStyle = null;
    let currentColSpan = 0;
    for (let i = 0; i < allDates.length; i++) {
        const date = allDates[i];
        const style = getCellStyle(i);
        if (style !== currentStyle) {
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

        if (date === null) {
            dateCells.push(
                <td
                    key={`${id}-${i}`}
                    colSpan="1"
                    className={`${s.cell} ${currentIndentLevel > 0 ? s.ganttCellIndent : ''}`}
                ></td>
            );
            currentColSpan = 0;
        }
    }

    if (currentColSpan > 0) {
        dateCells.push(
            <td
                key={`${id}-${allDates.length - currentColSpan}`}
                colSpan={currentColSpan}
                className={`${currentStyle} ${currentIndentLevel > 0 ? s.ganttCellIndent : ''}`}
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
