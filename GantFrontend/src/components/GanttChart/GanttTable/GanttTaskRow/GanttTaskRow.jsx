import React, { useState } from 'react';
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
    const [startDragOffset, setStartDragOffset] = useState(0);
    const [endDragOffset, setEndDragOffset] = useState(0);
    const [startIndex, setStartIndex] = useState(
        Math.round((new Date(taskStartDate) - startDate) / (1000 * 60 * 60 * 24))
    );
    const [endIndex, setEndIndex] = useState(
        Math.round((new Date(taskEndDate) - startDate) / (1000 * 60 * 60 * 24))
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

    const handleStartDateDragStart = (event) => {
        const initialOffset =
            event.clientX - event.target.getBoundingClientRect().left;
        setStartDragOffset(0);
        document.addEventListener('mousemove', handleStartDateDrag, true);
        document.addEventListener('mouseup', handleStartDateDragEnd, true);
        event.preventDefault();
    };

    const handleStartDateDrag = (event) => {
        const newOffset = Math.round(
            (event.clientX - event.target.getBoundingClientRect().x) / 100
        );
        const newStartIndex = startIndex + newOffset;

        // Ensure the newStartIndex stays within valid bounds
        const minIndex = 0;
        const maxIndex = endIndex - 1;
        const clampedIndex = Math.min(Math.max(newStartIndex, minIndex), maxIndex);

        setStartIndex(clampedIndex);
        setStartDragOffset(clampedIndex - startIndex);
        event.preventDefault();
    };

    const handleStartDateDragEnd = () => {
        document.removeEventListener('mousemove', handleStartDateDrag, true);
        document.removeEventListener('mouseup', handleStartDateDragEnd, true);

        const newStartDate = new Date(startDate);
        newStartDate.setDate(newStartDate.getDate() + startIndex);
        const newEndDate = new Date(startDate);
        newEndDate.setDate(newEndDate.getDate() + endIndex);

        editDates(id, {
            planned_start_date: newStartDate.toISOString().split('T')[0],
            planned_final_date: newEndDate.toISOString().split('T')[0],
            deadline: deadTask
        });
    };

    const handleEndDateDragStart = (event) => {
        const initialOffset =
            event.clientX - event.target.getBoundingClientRect().right;
        setEndDragOffset(0);
        document.addEventListener('mousemove', handleEndDateDrag, true);
        document.addEventListener('mouseup', handleEndDateDragEnd, true);
        event.preventDefault();
    };

    const handleEndDateDrag = (event) => {
        const newOffset = Math.round(
            (event.clientX - event.target.getBoundingClientRect().right + 100) / 100
        );
        const newEndIndex = endIndex + newOffset;

        const minIndex = startIndex + 1;
        const maxIndex = projectDurationInDays - 1;
        const clampedIndex = Math.min(Math.max(newEndIndex, minIndex), maxIndex);

        setEndIndex(clampedIndex);
        setEndDragOffset(clampedIndex - endIndex);
        event.preventDefault();
    };

    const handleEndDateDragEnd = () => {
        document.removeEventListener('mousemove', handleEndDateDrag, true);
        document.removeEventListener('mouseup', handleEndDateDragEnd, true);

        const newStartDate = new Date(startDate);
        newStartDate.setDate(newStartDate.getDate() + startIndex);
        const newEndDate = new Date(startDate);
        newEndDate.setDate(newEndDate.getDate() + endIndex);

        editDates(id, {
            planned_start_date: newStartDate.toISOString().split('T')[0],
            planned_final_date: newEndDate.toISOString().split('T')[0],
            deadline: deadTask
        });
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
