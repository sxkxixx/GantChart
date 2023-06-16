import api from "./api";
import {setItem} from "../utils/storage";


export const getAllTask = async () =>{
    try {
        const response = await api.get('/api/v1/gant/tasks')
        setItem('allTasks', response.data)
        return response.data
    }catch (e) {
        console.log(e)
    }
}

export const getIdTask = async (id) =>{
    try {
        const response = await api.get(`/api/v1/gant/task/${id}`)
        setItem('taskId', response.data)
        return response.data
    }catch (e) {
        console.log(e)
    }
}

export const createTask = async (task, stages) =>{
    const data = {
        task: task,
        stages: stages
    }
    const response = await api.post('/api/v1/gant/task/create', data)
    setItem('taskId', response.data)
}

export const updateIdTask = async (id, task, stages) =>{
    const data = {
        task: task,
        stages: stages
    }
    const response = await api.post(`/api/v1/gant/task/${id}/edit_dates`, data)
    setItem('taskId', response.data)
}

export const deleteIdTask = async (id) =>{
    const response = await api.delete(`/api/v1/gant/task/${id}/del`)
    setItem('taskId', response.data)
}



export const kanbanView = async (id, isOnKanban) =>{
    const response = await api.post(`/api/v1/gant/task/${id}/kanban_view`)
    setItem('kanbanView', response.data)
}
