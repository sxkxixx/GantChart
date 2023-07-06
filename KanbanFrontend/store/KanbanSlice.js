import { createSlice } from "@reduxjs/toolkit"

const name = "kanban";

const initialState = {
    taskExecutorFilter: "Все задачи",
    currentUser: {
        id: 1,
        name: "Свой",
        surname: "Исполнитель",
        patronymic: "Отчестов",
    }
};
const rootSlice = createSlice({
    name,
    initialState,
    reducers:{
        setProjectFilter: (options, action) => {
            options.projectFilter = action.payload;
        },
        setExecutorFilter: (options, action) => {
            options.taskExecutorFilter = action.payload;
        }
    },
    extraReducers: (builder) => {

    }
});

export const kanbanReducer = rootSlice.reducer;
export const {setProjectFilter, setExecutorFilter} = rootSlice.actions;
