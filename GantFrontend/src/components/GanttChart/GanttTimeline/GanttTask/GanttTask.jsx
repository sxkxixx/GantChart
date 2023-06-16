import React from "react";

const GanttTask = ({
                       name,
                       startDate,
                       endDate,
                       parentId,
                       children,
                       tasks,
                       indentLevel,
                       currentDepth,
                       levels,
                       maxDurationInDays,
                       firstStartDate,
                       isCollapsed,
                       collapsedTasks,
                       toggleTaskCollapse,
                   }) => {
// Обновляем уровни для текущей задачи
    const start = startDate?.getTime();
    const end = endDate?.getTime();
    let depth = 1;
    for (let i = start; i <= end; i += 86400000) {
// 86400000 - количество миллисекунд в дне
        if (levels[i] && levels[i] >= depth) {
            depth = levels[i] + 1;
        }
        levels[i] = depth;
    }

// Устанавливаем значение parentId для текущей задачи
    let taskParentId = null;
    if (tasks) {
        const parentTask = tasks.find((t) => t.id === parentId);
        taskParentId = parentTask ? parentTask.id : null;
    }

    const isTaskCollapsed =
        Array.isArray(collapsedTasks) && collapsedTasks.includes(name);

    const duration =
        startDate && endDate
            ? (endDate - startDate) / (1000 * 60 * 60 * 24) + 1
            : 0;

    return (
        <>
            <div
                key={name}
                style={{
                    height: "50px",
                    backgroundColor: "lightblue",
                    marginBottom: "5px",
                    paddingLeft: `${indentLevel * 20}px`,
                    marginTop: `${(depth - currentDepth) * 55}px`, // Рассчитываем вертикальное смещение для задачи
                }}
            >
                <span>{name}</span>
                <button onClick={() => toggleTaskCollapse(name)}>
                    {isTaskCollapsed ? "+" : "-"}
                </button>
                <div
                    style={{
                        height: "10px",
                        backgroundColor: "grey",
                        position: "relative",
                        marginTop: "5px",
                    }}
                >
                    <div
                        style={{
                            height: "100%",
                            width: `${duration * (100 / maxDurationInDays)}%`,
                            backgroundColor: "green",
                            position: "absolute",
                            left: `${((startDate.getTime() - firstStartDate) / (1000 * 60 * 60 * 24)) * (100 / maxDurationInDays)}  %,`
                        }}
                    ></div>
                </div>
            </div>
            {!isTaskCollapsed && children && (
                <GanttTask
                    name={children.name}
                    startDate={children.startDate}
                    endDate={children.endDate}
                    parentId={parentId}
                    children={children.children}
                    tasks={tasks}
                    indentLevel={indentLevel + 1}
                    currentDepth={depth}
                    levels={levels}
                    isCollapsed={isTaskCollapsed}
                />
            )}
        </>
    );
};

export default GanttTask;
