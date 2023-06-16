import React, { useState } from "react";
import GanttTask from "./GanttTask/GanttTask";
import s from "./GantTimeline.module.css";

const GanttTimeline = ({ tasks, indentLevel = 0 }) => {
    const firstStartDate = Math.min(
        ...tasks.map((task) => task.startDate.getTime())
    );

    const maxDurationInDays = Math.max(
        ...tasks.map(
            (task) =>
                (task.endDate.getTime() - task.startDate.getTime()) / (1000 * 60 * 60 * 24)
        )
    );

    const [collapsedTasks, setCollapsedTasks] = useState([]);

    const toggleTaskCollapse = (taskId) => {
        if (collapsedTasks.includes(taskId)) {
            setCollapsedTasks(collapsedTasks.filter((id) => id !== taskId));
        } else {
            setCollapsedTasks([...collapsedTasks, taskId]);
        }
    };

    const renderTask = (task, currentDepth, levels) => (
        <GanttTask
            key={task.id}
            name={task.name}
            startDate={task.startDate}
            endDate={task.endDate}
            parentId={task.parentId}
            children={task.children}
            tasks={tasks}
            indentLevel={indentLevel} // Используем общий отступ
            currentDepth={currentDepth}
            levels={levels}
            maxDurationInDays={maxDurationInDays}
            firstStartDate={firstStartDate}
            isCollapsed={false}
            collapsedTasks={collapsedTasks}
            toggleTaskCollapse={toggleTaskCollapse}
        />
    );

    const renderTasks = (tasks, currentDepth = 1, levels = {}) => (
        <div className={s.tasks}>
            {tasks.map((task) => {
                const renderedTask = Array.isArray(task.children)
                    ? renderTasks(task.children, currentDepth + 1, levels)
                    : renderTask(task, currentDepth, levels);

                return (
                    <div
                        key={task.id}
                        style={{ marginLeft: `${(task.indentLevel - 1) * 20}px`, marginTop: `${(levels[task.startDate.getTime()] - currentDepth) * 55}px` }}
                    >
                        {renderedTask}
                    </div>
                );
            })}
        </div>
    );

    return <div className={s.container}>{renderTasks(tasks)}</div>;
};

export default GanttTimeline;
