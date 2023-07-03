import { createSelector } from '@reduxjs/toolkit';
import { kanbanApi } from "./Api";

const selectSerializableTasks = kanbanApi.endpoints.getShortTasksSerializable.select();

export const selectShortTasks = createSelector(
    selectSerializableTasks,
    (serializableShortTasksResponseResponse) =>
    {

        return {
            ...serializableShortTasksResponseResponse,
            data: serializableShortTasksResponseResponse.data?.map(sts => (
                {
                    ...sts,
                    deadline: new Date(sts.deadline),
                }))
        }
    }
)
