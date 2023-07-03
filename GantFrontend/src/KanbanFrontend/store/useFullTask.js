import { kanbanApi } from "./Api";

export const useFullTask = () => {
    const [trigger, response] = kanbanApi.endpoints.getFullTaskSerializable.useLazyQuery();

    if (response.data) {
        const data = response.data;

        return [
            trigger,
            {
                ...response,
                data: {
                    ...data,
                    deadline: new Date(data.deadline),
                    plannedDates: {
                        begin: new Date(data.plannedDates.begin),
                        end: new Date(data.plannedDates.end),
                    },
                    parentTask: {
                        ...data.parentTask,
                        deadline: new Date(data.parentTask?.deadline),
                    },
                    comments: data.comments.map((comment) => ({
                        ...comment,
                        time: new Date(comment.time),
                    })),
                    wastedTime: new Date(data.wastedTime),
                },
            },
        ];
    }

    return [trigger, response];
};
