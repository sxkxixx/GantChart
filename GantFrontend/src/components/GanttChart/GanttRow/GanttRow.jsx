import React from 'react';
import s from './GanttRow.module.css';

const GanttRow = ({ task, earliestDate, projectDurationInDays, dateArray }) => {
    // Get indexes of start and end dates
    const startDateIndex = dateArray.findIndex(date => date.toLocaleDateString() === task.startDate.toLocaleDateString());
    const endDateIndex = dateArray.findIndex(date => date.toLocaleDateString() === task.endDate.toLocaleDateString());

    return (
        <tr className={s.ganttRow}>
            {[...Array(projectDurationInDays)].map((_, i) => {
                // Add empty cell if current date is outside of start and end dates
                if (i < startDateIndex || i > endDateIndex) {
                    return <td key={i} className={[s.ganttCell, s.ganttCellEmpty].join(' ')}></td>;
                }
                // Add active cell if current date is within start and end dates
                else {
                    const currentDate = dateArray[i];
                    const cellClasses = [s.ganttCell];
                    if (currentDate >= task.startDate && currentDate <= task.endDate) {
                        cellClasses.push(s.ganttCellActive);
                    }
                    return <td key={i} className={cellClasses.join(' ')}></td>;
                }
            })}
        </tr>
    );
};

export default GanttRow;
