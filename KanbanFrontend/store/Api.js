import { TaskConverter } from "@kanban/dto/TaskConverter";
import { SqlDateConverter } from "@kanban/utils/converters/SqlDateConverter";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const buildKanbanApiMock = () => createApi(
    {
        baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8050" }),
        tagTypes: ["tasks"],
        endpoints: (builder) =>
        {
            return {
                getShortTasksSerializable: builder.query({
                query: () => "/tasks",
                providesTags: ["tasks"],
            }),
                getFullTaskSerializable: builder.query({
            query: (taskId) => `tasks/${taskId}`,
        }),
            patchTaskStatus: builder.mutation({
            queryFn: (arg, api, options, baseFetch) =>
            {
                const resposne = baseFetch(`/tasks/${arg.taskId}`)
                const result = resposne.then((task) =>
                {
                    const statusResponse = baseFetch(`/statuses/${arg.newStatusId}`)
                    return statusResponse.then(status => ({
                        task: task.data,
                        status: status.data,
                    }))
                }).then(data =>
                {
                    return baseFetch({
                        url: `tasks/${arg.taskId}`,
                        method: "Put",
                        body: {
                            ...(data.task),
                            status: data.status,
                        }
                    })
                }).then(() => ({
                    data: {
                        message: "successful"
                    }
                }));

                return result;
            },
            invalidatesTags: ["tasks"]
        }),
            putFullTask: builder.mutation({
            query: () => ({
                url: "/tasks",
                method: "Put",
            }),
            invalidatesTags: ["tasks"]
        }),
            removeTaskFromKanban: builder.mutation({
            query: (taskId) => ({
                url: `/tasks/${taskId}`,
                method: "Put",
                body: {
                    is_on_kanban: 0,
                }
            }),
            invalidatesTags: ["tasks"]
        }),
            getProjects: builder.query({
            query: () => "/projects",
        }),
            getCurrentUser: builder.query({
            query: () => "user/current",
        }),
            getTags: builder.query({
            query: () => "/teams"
        }),
            getUsers: builder.query({
            query: () => "/users"
        }),
            addFullTask: builder.mutation({
            //@ts-ignore
            queryFn: (args) => ({
                data: {
                    ...args,
                    deadline: args.deadline?.getMilliseconds(),
                    plannedDates: {
                        begin: args.deadline?.getMilliseconds(),
                        end: args.deadline?.getMilliseconds(),
                    },
                    wastedTime: args.wastedTime?.getMilliseconds(),
                }
            })
        }),
            removeTask: builder.mutation({
            query: (args) => ({
                url: `tasks/${args}`,
                method: "Delete",
            }),
            invalidatesTags: ["tasks"],
            transformResponse: () => ({ message: "successful" })
        })
        }
        },
        reducerPath: "kanbanApi"
    }
);


const baseUrl = import.meta.env.VITE_KANBAN_API_URI;

const buildKanbanApiRemote = () => createApi(
    {
        baseQuery: fetchBaseQuery({ baseUrl }),
        tagTypes: ["tasks"],
        endpoints: (builder) =>
        {
            return {
                getShortTasksSerializable: builder.query({
                query: () => "/tasks",
                providesTags: ["tasks"],
                transformResponse: (baseQuery) =>
                {
                    return baseQuery.map(dto => ({
                        author: {
                            id: dto.responsible_id,
                            name: dto.responsible_first_name,
                            surname: dto.responsible_last_name,
                            patronymic: dto.responsible_patronymic
                        },
                        responsible: {
                            id: dto.responsible_id,
                            name: dto.responsible_first_name,
                            surname: dto.responsible_last_name,
                            patronymic: dto.responsible_patronymic
                        },
                        contractors: [],
                        deadline: SqlDateConverter.toJs(dto.deadline).getMilliseconds(),
                        id: dto.task_id,
                        project: {
                            id: dto.project_id,
                            name: dto.project_name
                        },
                        tag: {
                            id: dto.team_id,
                            tag: dto.team_tag,
                        },
                        status: {
                            id: dto.status_id,
                            name: dto.status_name,
                        },
                        title: dto.task_name
                    }));
                }
            }),
                getFullTaskSerializable: builder.query({
            query: (taskId) => `tasks/${taskId}`,
            transformResponse: (dto) =>
            {
                return new TaskConverter().fullDtoToSerilizable(dto);
            },
        }),
            patchTaskStatus: builder.mutation({
            query: (args) => (
                {
                    url: `/tasks/${args.taskId}`,
                    method: "Put",
                    body: {
                        status_id: args.newStatusId
                    }
                }),
            invalidatesTags: ["tasks"]
        }),
            putFullTask: builder.mutation({
            query: (task) => ({
                url: "/tasks",
                method: "Put",
                body: new TaskConverter().fullModelToDto(task),
            }),
            invalidatesTags: ["tasks"]
        }),
            addFullTask: builder.mutation({
            query: (task) => ({
                url: "/tasks",
                method: "Post",
                body: new TaskConverter().fullModelToDto(task),
            }),
            invalidatesTags: ["tasks"],
        }),
            removeTask: builder.mutation({
            query: (id) => ({
                url: `tasks/${id}`,
                method: "Post",
                body: {
                    _method: "Delete",
                }
            }),
            invalidatesTags: ["tasks"]
        }),
            removeTaskFromKanban: builder.mutation({
            query: (taskId) => ({
                url: `/tasks/${taskId}`,
                method: "Put",
                body: {
                    is_on_kanban: 0,
                }
            }),
            invalidatesTags: ["tasks"]
        }),
            getProjects: builder.query({
            query: () => "/projects",
            transformResponse: (baseQuery) =>
            {
                return baseQuery.map(dto => ({
                    id: dto.id,
                    name: dto.title,
                }))
            },

        }),
            getUsers: builder.query({
            query: () => "/users",
            transformResponse: (data) =>
            {
                return data.map(user => ({
                    id: user.id,
                    name: user.first_name,
                    surname: user.last_name,
                    patronymic: user.patronymic
                }))
            },
        }),
            getTags: builder.query({
            query: () => "/teams",
            transformResponse: (data) =>
            {
                return data.map(t => ({
                    id: t.id,
                    tag: t.teg,
                }))
            }
        }),
        }
        },
        reducerPath: "kanbanApi"
    }
);

//can't map typeof Dto to model
//@ts-ignore
export const kanbanApi
    = import.meta.env.VITE_KANBAN_MOCK_API === "true" ? buildKanbanApiMock() : buildKanbanApiRemote();


const {
    useGetShortTasksSerializableQuery,
    useGetProjectsQuery,
    useGetFullTaskSerializableQuery,
    usePatchTaskStatusMutation,
    useRemoveTaskFromKanbanMutation,
    useGetTagsQuery,
    useGetUsersQuery,
    useAddFullTaskMutation,
} = kanbanApi;

export const kanbanApiContainer = {
    usePatchTaskStatusMutation,
    useGetShortTasksSerializableQuery,
    useGetProjectsQuery,
    useGetFullTaskSerializableQuery,
    useRemoveTaskFromKanbanMutation,
    useGetTagsQuery,
    useGetUsersQuery,
    useAddFullTaskMutation,
}
