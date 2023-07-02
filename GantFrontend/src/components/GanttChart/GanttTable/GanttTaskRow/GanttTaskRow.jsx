import React, { useState } from 'react';
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

    // const [startIndex, setStartIndex] = useState(
    //     Math.round((new Date(taskStartDate) - startDate) / (1000 * 60 * 60 * 24))
    // );
    // const [endIndex, setEndIndex] = useState(
    //     Math.round((new Date(taskEndDate) - startDate) / (1000 * 60 * 60 * 24))
    // );

    const startIndex = (
        Math.round((new Date(taskStartDate) - startDate) / (1000 * 60 * 60 * 24))
    )

    const endIndex = (
        Math.round((new Date(taskEndDate) - startDate) / (1000 * 60 * 60 * 24))
    )

    const getCellStyle = (indentLevel) => {
        let colorClass;
        if (indentLevel === 0 || indentLevel === 1) {
            colorClass = s.cellColor1;
        } else {
            colorClass = s.cellColor2;
        }

        return `${colorClass}`;
    }

    // const handleDragStartIndex = (event) => {
    //     handleDragIndex(event, startIndex, setStartIndex);
    // };
    //
    // const handleDragEndIndex = (event) => {
    //     handleDragIndex(event, endIndex, setEndIndex);
    // };
    //
    // const handleDragIndex = (event, currentIndex, setCurrentIndex) => {
    //     const initialMouseX = event.pageX
    //     const initialIndex = currentIndex
    //
    //     const handleMouseMove = (event) => {
    //         const deltaX = event.pageX - initialMouseX
    //
    //         const currentIndexDelta = Math.round(
    //             (deltaX / event.target.offsetWidth) * projectDurationInDays
    //         );
    //
    //         const newStartIndex = Math.max(
    //             Math.min(initialIndex + currentIndexDelta, endIndex),
    //             0
    //         )
    //
    //         const newEndIndex = Math.min(
    //             Math.max(endIndex + currentIndexDelta, startIndex),
    //             projectDurationInDays - 1
    //         )
    //
    //         setCurrentIndex(currentIndex === startIndex ? newStartIndex : newEndIndex);
    //     };
    //
    //     const handleMouseUp = () => {
    //         document.removeEventListener('mousemove', handleMouseMove);
    //         document.removeEventListener('mouseup', handleMouseUp);
    //     };
    //
    //     document.addEventListener('mousemove', handleMouseMove);
    //     document.addEventListener('mouseup', handleMouseUp,  { once: true });
    // };

    const dateCells = [];
    const activeCellIndex = new Set();
    for (let i = 0; i < projectDurationInDays; i++) {
        const isActiveCell = i >= startIndex && i <= endIndex;
        if (isActiveCell) {
            activeCellIndex.add(i);
        }
        const style = `${s.cell} ${
            isActiveCell ? getCellStyle(currentIndentLevel) : ''
        }`;
        const cellClassName =
            i === startIndex
                ? `${style} ${s.startCell}`
                : i === endIndex
                    ? `${style} ${s.endCell}`
                    : i > startIndex && i < endIndex
                        ? `${style} ${s.middleCell}`
                        : style;
        dateCells.push(
            <div className={cellClassName} key={`${id}-${i}`}>
                {isActiveCell && <div
                    className={s.isActiveCellOverlay}
                    // onMouseDown={
                    //     i === startIndex
                    //         ? handleDragStartIndex
                    //         : i === endIndex
                    //             ? handleDragEndIndex
                    //             : undefined
                    // }
                />
                }
            </div>
        );
    }


    return (
        <>
            <div className={s.row} key={id}>
                {dateCells.map((cell, index) => (
                    <div
                        className={s.cellWrapper}
                        key={`${id}-cell-${index}`}
                    >
                        {cell}
                    </div>
                ))}
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
