import React from 'react';
import s from './GanttTaskRow.module.css';

const GanttTaskRow = ({
                          task,
                          projectDurationInDays,
                          startDate,
                          collapsedTasks,
                          indentLevel = 0,
                      }) => {
    const {
        id,
        planned_start_date: taskStartDate,
        planned_final_date: taskEndDate,
        children,
    } = task;

    const isCollapsed = collapsedTasks.includes(id);
    const currentIndentLevel = indentLevel;

    const startIndex = Math.round(
        (new Date(taskStartDate) - startDate) / (1000 * 60 * 60 * 24)
    );

    const endIndex = Math.round(
        (new Date(taskEndDate) - startDate) / (1000 * 60 * 60 * 24)
    );

    const getCellStyle = (indentLevel) => {
        let colorClass;
        if (indentLevel === 0 || indentLevel === 1) {
            colorClass = s.cellColor1;
        } else {
            colorClass = s.cellColor2;
        }

        return `${colorClass}`;
    };

    const renderEmptyCells = (start, end) => {
        const emptyCells = [];
        for (let i = start; i <= end; i++) {
            emptyCells.push(
                <div className={`${s.cellWrapper} ${s.emptyCell}`} />
            );
        }
        return emptyCells;
    };

    const renderActiveCell = (start, end) => {
        return (
            <div
                className={`${s.activeCellWrapper} ${getCellStyle(currentIndentLevel)}`}
                style={{ left: `${start * 100}px`, width: `${(end - start + 1) * 100}px` }}
            />
        );
    };

    return (
        <>
            <div className={s.row} key={id}>
                {renderEmptyCells(0, projectDurationInDays - 1)}
                {renderActiveCell(startIndex, endIndex)}
            </div>
            {!isCollapsed &&
                children &&
                children.map((childTask) => (
                    <GanttTaskRow
                        key={childTask.id}
                        task={childTask}
                        projectDurationInDays={projectDurationInDays}
                        startDate={startDate}
                        collapsedTasks={collapsedTasks}
                        indentLevel={currentIndentLevel + 1}
                    />
                ))}
        </>
    );
};

export default GanttTaskRow;
