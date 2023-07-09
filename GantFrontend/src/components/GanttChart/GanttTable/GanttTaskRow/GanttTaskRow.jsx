import React, {useEffect, useState} from 'react';
import s from './GanttTaskRow.module.css';
import {editDates} from "../../../../services/task";

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
        deadline: deadTask,
        children,
    } = task;

    const isCollapsed = collapsedTasks.includes(id);
    const currentIndentLevel = indentLevel;

    const [startIndex, setStartIndex] = useState(
        Math.round((new Date(taskStartDate) - startDate) / (1000 * 60 * 60 * 24))
    );
    const [endIndex, setEndIndex] = useState(
        Math.round((new Date(taskEndDate) - startDate) / (1000 * 60 * 60 * 24))
    );
    const [isDragged, setIsDragged] = useState(false); // New state variable

    const handleStartEndIndexesChange = () => {
        const newStartDate = new Date(startDate);
        newStartDate.setDate(newStartDate.getDate() + startIndex);
        const newEndDate = new Date(startDate);
        newEndDate.setDate(newEndDate.getDate() + endIndex);

        const formattedStartDate = newStartDate.toISOString().split('T')[0];
        const formattedEndDate = newEndDate.toISOString().split('T')[0];

        const updatedTask = {
            ...task,
            planned_start_date: formattedStartDate,
            planned_final_date: formattedEndDate,
            deadline: deadTask,
        };

        editDates(id, updatedTask);
    };

    useEffect(() => {
        if (isDragged) {
            const debounceTimer = setTimeout(handleStartEndIndexesChange, 250);

            return () => {
                clearTimeout(debounceTimer);
            };
        }
    }, [startIndex, endIndex, isDragged]);

    const getCellStyle = (indentLevel) => {
        let colorClass;
        if (indentLevel === 0 || indentLevel === 1) {
            colorClass = s.cellColor1;
        } else {
            colorClass = s.cellColor2;
        }

        return `${colorClass}`;
    };

    const handleStartDateDragStart = (event) => {
        const initialX = event.clientX;

        const handleMouseMove = (event) => {
            const diff = Math.round((event.clientX - initialX) / 100);
            const newStartIndex = startIndex + diff;

            if (newStartIndex >= 0 && newStartIndex <= endIndex) {
                setStartIndex(newStartIndex);
                setIsDragged(true); // Set the dragged state to true
            }
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            setIsDragged(false); // Reset the dragged state to false
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleEndDateDragStart = (event) => {
        const initialX = event.clientX;

        const handleMouseMove = (event) => {
            const diff = Math.round((event.clientX - initialX) / 100);
            const newEndIndex = endIndex + diff;

            if (newEndIndex >= startIndex && newEndIndex < projectDurationInDays) {
                setEndIndex(newEndIndex);
                setIsDragged(true); // Set the dragged state to true
            }
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            setIsDragged(false); // Reset the dragged state to false
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const renderEmptyCells = (start, end) => {
        const emptyCells = [];
        for (let i = start; i <= end; i++) {
            emptyCells.push(
                <div className={`${s.cellWrapper} ${s.emptyCell}`} key={i} />
            );
        }
        return emptyCells;
    };

    const renderActiveCell = (start, end) => {
        return (
            <>
                <div
                    className={s.startDate}
                    style={{ left: `${start * 100}px`, width: `100px` }}
                    onMouseDown={handleStartDateDragStart}
                />
                <div
                    className={`${s.activeCellWrapper} ${getCellStyle(currentIndentLevel)}`}
                    style={{ left: `${start * 100}px`, width: `${(end - start + 1) * 100}px` }}
                />
                <div
                    className={s.endDate}
                    style={{ left: `${end * 100}px`, width: `100px` }}
                    onMouseDown={handleEndDateDragStart}
                />
            </>
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
