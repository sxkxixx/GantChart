import api from "./api";
import {setItem} from "../utils/storage";


export const getAllTask = async () =>{
    try {
        const response = await api.get('/api/v1/gant/tasks')
        return response.data
    }catch (e) {
        console.log(e)
    }
}

export const getIdTask = async (id) =>{
    try {
        const response = await api.get(`/api/v1/gant/task/${id}`)
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
}

export const updateIdTask = async (id, task, stages) =>{
    const data = {
        task: task,
        stages: stages
    }
    const response = await api.post(`/api/v1/gant/task/${id}/edit_dates`, data)
}

export const deleteIdTask = async (id) =>{
    const response = await api.delete(`/api/v1/gant/task/${id}/del`)
}



export const kanbanView = async (id, isOnKanban) =>{
    const response = await api.post(`/api/v1/gant/task/${id}/kanban_view`)
}
