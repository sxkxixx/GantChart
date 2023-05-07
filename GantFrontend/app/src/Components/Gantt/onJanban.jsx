import axios from "axios";

export function onKanbanViewChange(taskId, isOnKanban) {
    axios.post(`http://127.0.0.1:8000/api/v1/gant/task/${taskId}/kanban_view`, { is_on_kanban: isOnKanban })
        .then(response => {
            console.log(response.data);
            window.location.reload()
        })
        .catch(error => {
            console.error(error);
        });
}