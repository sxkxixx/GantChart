import React from 'react';
import s from './GanttTaskRow.module.css';

const GanttTaskRow = ({ task, projectDurationInDays, toggleTaskCollapse, collapsedTasks }) => {
    const { id, startDate, endDate, children } = task;

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

    return (
        <>
            <tr key={id}>
                {[...Array(projectDurationInDays)].map((_, i) => (
                    <td
                        key={`${id}-${i}`}
                        className={getCellStyle(
                            new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
                        )}
                    ></td>
                ))}
            </tr>
            {children &&
                collapsedTasks &&
                !collapsedTasks.includes(id) &&
                children.map((childTask) => (
                    <GanttTaskRow
                        key={childTask.id}
                        task={childTask}
                        projectDurationInDays={projectDurationInDays}
                        toggleTaskCollapse={toggleTaskCollapse}
                        collapsedTasks={collapsedTasks}
                    />
                ))}
        </>
    );
};

export default GanttTaskRow;
