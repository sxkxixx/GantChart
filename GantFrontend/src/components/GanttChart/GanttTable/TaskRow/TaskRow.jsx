import React from 'react';
import s from './TaskRow.module.css';

const TaskRow = ({
                     task,
                     indentLevel = 0,
                     collapsedTasks = [],
                     toggleTaskCollapse,
                 }) => {
    const hasChildren = task.children && task.children.length > 0;

    const isCollapsed = collapsedTasks.includes(task.id);

    return (
        <>
            <tr
                className={`${s.taskRow}${isCollapsed ? ` ${s.collapsed}` : ''}`}
                onClick={() => toggleTaskCollapse(task.id)}
            >
                <td style={{ paddingLeft: `${indentLevel * 20}px` }}>
                    {hasChildren && (
                        <span className={s.collapseButton}>
              {isCollapsed ? '▶' : '▼'}
            </span>
                    )}
                    {task.name}
                </td>
            </tr>

            {hasChildren &&
                !isCollapsed &&
                task.children.map((childTask) => (
                    <TaskRow
                        key={childTask.id}
                        task={childTask}
                        indentLevel={indentLevel + 1}
                        collapsedTasks={collapsedTasks}
                        toggleTaskCollapse={toggleTaskCollapse}
                    />
                ))}
        </>
    );
};

export default TaskRow;
