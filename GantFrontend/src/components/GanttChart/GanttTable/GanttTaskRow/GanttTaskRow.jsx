import React from 'react';
import s from './GanttTaskRow.module.css';

const GanttTaskRow = ({
                          task,
                          projectDurationInDays,
                          startDate,
                          toggleTaskCollapse,
                          collapsedTasks,
                          indentLevel = 0,
                      }) => {
    const {id, name, startDate: taskStartDate, endDate: taskEndDate, children} = task;

    const isCollapsed = collapsedTasks.includes(id);

    let currentIndentLevel = indentLevel;

    if (children && !isCollapsed) {
        currentIndentLevel++;
    }

    const getCellStyle = (date) => {
        if (taskStartDate && taskEndDate) {
            if (date >= taskStartDate && date <= taskEndDate) {
                return s.cellActive;
            } else {
                return s.emptyCell;
            }
        }
    }

    const handleCollapseToggle = () => {
        toggleTaskCollapse(id);
    };

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

    return (
        <>
            <tr key={id} onClick={handleCollapseToggle}>
                {allDates.map((date, index) => {
                    const dateCellStyle = getCellStyle(date);
                    return (
                        <td
                            key={`${id}-${index}`}
                            colSpan="1"
                            className={`${dateCellStyle} ${currentIndentLevel > 0 ? s.ganttCellIndent : ''} ${date ? '' : s.emptyDateCell}`}
                            style={{paddingLeft: undefined}}
                        >
                        </td>
                    );
                })}
            </tr>
            {children &&
                !isCollapsed &&
                children.map((childTask) => (
                    <GanttTaskRow
                        key={childTask.id}
                        task={childTask}
                        projectDurationInDays={projectDurationInDays}
                        startDate={startDate}
                        collapsedTasks={collapsedTasks}
                        toggleTaskCollapse={toggleTaskCollapse}
                        indentLevel={currentIndentLevel}
                    />
                ))}
        </>
    );
};

export default GanttTaskRow;
