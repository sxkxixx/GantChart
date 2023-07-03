import { useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import styled from "styled-components";
import { useAppSelector } from "../../shared/src/store/Hooks";
import { Board } from "./components/Board";
import { KanbanHeader } from "./components/KanbanHeader";
import { TaskCreate } from "./components/TaskCreate/TaskCreate";
import { TaskEdit } from "./components/TaskEdit/TaskEdit";
import { TaskLoader } from "./components/TaskLoader/TaskLoader";
import { TaskView } from "./components/TaskView/TaskView";
import { BaseStatuses } from "./data/Status";
import { kanbanApiContainer } from "./store/Api";
import { selectFilteredShortTasks } from "./store/FilteredTaskSelector";
import { useFullTask } from "./store/useFullTask";

const Container = styled.div`
    padding-top: 32px;
    max-width: 1664px;
    margin: 0 auto;
`;

const useFilteredShortTasks = () => {
    kanbanApiContainer.useGetShortTasksSerializableQuery();

    return useAppSelector(selectFilteredShortTasks);
}

export const KanbanPage = () =>
{
    const tasks = useFilteredShortTasks().data;
    const [removeTaskFromKanban] = kanbanApiContainer.useRemoveTaskFromKanbanMutation();
    const [addTask] = kanbanApiContainer.useAddFullTaskMutation();
    const [patchStatus] = kanbanApiContainer.usePatchTaskStatusMutation();
    const [getFullTask, fullTaskResponse] = useFullTask();
    const taskViewRef = useRef(null);

    const [stage, setStage] = useState(null);

    if (!tasks)
    {
        return <TaskLoader />;
    }

    const handleStatusChange = (task, statusId) =>
    {
        patchStatus({ taskId: !task.id, newStatusId: statusId });
    }

    const handleTaskAdd = (fullTask) => {
        console.log(fullTask);
        addTask(fullTask);
    }

    function removeCompletedTasks()
    {
        for (const task of tasks.filter(t => t.status.id == BaseStatuses.Completed.id))
        {
            removeTaskFromKanban(!task.id);
        }
    }

    function renderModal()
    {
        const canRender = !!fullTaskResponse.data && tasks?.length > 0 && !!stage;
        const fullTask = fullTaskResponse.data;

        return (
            <>
                <CSSTransition timeout={300} in={stage === "view" && canRender} unmountOnExit mountOnEnter>
                    <TaskView
                        onEdit={() => setStage("edit")}
                        ref={taskViewRef}
                        task={fullTask}
                        onClose={() => setStage(null)}
                    />
                </CSSTransition>
                <CSSTransition timeout={300} in={stage === "edit" && canRender} unmountOnExit mountOnEnter>
                    <TaskEdit
                        onChange={() => { }}
                        onSave={() => { }}
                        ref={taskViewRef}
                        task={fullTask}
                        onClose={() => setStage(null)}
                    />
                </CSSTransition>
                <CSSTransition timeout={300} in={stage === "create"} unmountOnExit mountOnEnter>
                    <TaskCreate ref={taskViewRef} onClose={() => setStage(null)} onCreate={handleTaskAdd} />
                </CSSTransition>
            </>
        );
    }

    return (
        <>
            <Container>
                <KanbanHeader deleteCompletedTasks={removeCompletedTasks} createTask={() => setStage("create")} />
                {tasks ? (
                    <Board
                        tasks={tasks}
                        onStatusChange={handleStatusChange}
                        onModalOpen={(id) =>
                        {
                            getFullTask(id, false);
                            setStage("view");
                        }}
                    />
                ) : (
                    <TaskLoader />
                )}
                {renderModal()}
            </Container>
        </>
    );
};

// TODO: fix Выполняются Выполняется
// TODO: алерт при удалении завершенных
// TODO: dropdown arrow don't close dropdown
