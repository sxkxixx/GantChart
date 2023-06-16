import React, { useState } from "react";
import s from "./TaskRow.module.css";

const TaskRow = ({ task, indentLevel = 0, collapsedTasks = [], toggleTaskCollapse }) => {
    const [expanded, setExpanded] = useState(false);

    const startDateString = task.startDate.toLocaleDateString();
    const endDateString = task.endDate.toLocaleDateString();
    const durationInDays =
        (task.endDate.getTime() - task.startDate.getTime()) / (1000 * 60 * 60 * 24);

    const hasChildren = task.children && task.children.length > 0;

    const toggleExpansion = () => {
        if (hasChildren) {
            setExpanded(!expanded);
            toggleTaskCollapse(task.id);
        }
    };

    const isCollapsed = collapsedTasks.includes(task.id);

    return (
        <>
            <tr
                className={`${s.taskRow}${isCollapsed ? ` ${s.collapsed}` : ""}`}
                onClick={toggleExpansion}
            >
                <td style={{ paddingLeft: `${indentLevel * 20}px` }}>
                    {hasChildren && (
                        <span className={s.collapseButton}>
                            {isCollapsed ? "▶" : "▼"}
                        </span>
                    )}
                    {task.name}
                </td>
                <td>{startDateString}</td>
                <td>{endDateString}</td>
                <td>{durationInDays} days</td>
                <td>{task.progress * 100}%</td>
            </tr>
            {expanded &&
                task.children &&
                task.children.map((child) => (
                    <TaskRow
                        key={child.id}
                        task={child}
                        indentLevel={indentLevel + 1}
                        collapsedTasks={collapsedTasks}
                        toggleTaskCollapse={toggleTaskCollapse}
                    />
                ))}
        </>
    );
};

export default TaskRow;
