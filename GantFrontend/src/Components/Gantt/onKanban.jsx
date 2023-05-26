import axios from "axios";

export function onKanbanViewChange(taskId, isOnKanban) {
    const url = process.env.REACT_APP_API_URL;

    axios.post(`${url}/api/v1/gant/task/${taskId}/kanban_view`, { is_on_kanban: isOnKanban })
        .then(response => {
            console.log(response.data);
            window.location.reload()
        })
        .catch(error => {
            console.error(error);
        });
}