import { createSelector } from "@reduxjs/toolkit";
import { selectShortTasks } from "./TaskShortSelector";

const selectProjectFilter = (store) => store.kanbanReducer.projectFilter;
const selectExecutorFilter = (store) => store.kanbanReducer.taskExecutorFilter;
const selectCurrentUser = (store) => store.kanbanReducer.currentUser;

export const selectFilteredShortTasks = createSelector(
    selectShortTasks,
    selectProjectFilter,
    selectExecutorFilter,
    selectCurrentUser,
    (tasksData, projectFilter, executorFilter, currentUser) =>
    {

        const filteredData = tasksData.data?.filter(
            task => isWantedProject(task, projectFilter) && isWasntedExecutor(task, executorFilter, currentUser)
        )

        if (filteredData)
        {
            return {
                ...tasksData,
                data: filteredData
            }
        }

        return tasksData;
    }
)

const isWantedProject = (task, project) =>
{
    if (!project)
    {
        return true;
    }

    return task.project.id === project.id;
}

const isWasntedExecutor = (task, executorFilter, executor) =>
{
    if (!executor || executorFilter === "Все задачи")
    {
        return true;
    }

    return task.author.id === executor.id || executor.id in task.contractors.map(c => c.id);
}
