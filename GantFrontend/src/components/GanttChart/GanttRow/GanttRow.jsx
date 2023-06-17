import React from 'react';
import s from './GanttRow.module.css';

const GanttRow = ({ task, earliestDate, projectDurationInDays }) => (
    <tr className={s.ganttRow}>
        <td>{' '.repeat(task.indentLevel * 4)}{task.name}</td>
        {[...Array(projectDurationInDays)].map((_, i) => {
            const currentDate = new Date(earliestDate);
            currentDate.setDate(currentDate.getDate() + i);
            const cellClasses = [s.ganttCell];
            if (currentDate >= task.startDate && currentDate <= task.endDate) {
                cellClasses.push(s.ganttCellActive);
            }
            return <td key={i} className={cellClasses.join(' ')}></td>;
        })}
    </tr>
);

export default GanttRow;
