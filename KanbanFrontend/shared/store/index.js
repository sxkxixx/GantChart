import { kanbanApi } from './../../../kanban-project/src/store/Api';
import { configureStore } from "@reduxjs/toolkit";
import { kanbanReducer } from '@mono-repo/kanban-project';
import { rootReducer } from "@mono-repo/root-project";
import { gradeReducer } from "@mono-repo/grade-project";

export const store = configureStore({
    reducer: {
        rootReducer,
        kanbanReducer,
        gradeReducer,
        [kanbanApi.reducerPath]: kanbanApi.reducer
    },
    middleware: function (getDefaultMiddleware) {
        return getDefaultMiddleware().concat(kanbanApi.middleware);
    }
});

export const AppDispatch = store.dispatch;
export const RootState = store.getState();
