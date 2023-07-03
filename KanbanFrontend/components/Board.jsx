import { BaseStatuses, Status } from "@kanban/data/Status";
import { useRef } from "react";
import styled from "styled-components";
import { Column } from "./Column/Column";

const Columns = styled.div`
    display: flex;
    gap: 16px;
    > * {
        flex-basis: 20%;
    }
`;

const statuses = Object.values(BaseStatuses);

export function Board(props) {
    const draggedTaskRef = useRef();

    function onDrop(e, colIndex, itemIndex, status) {
        if(draggedTaskRef.current?.status.id !== status.id){
            props.onStatusChange(!draggedTaskRef.current, status.id);
        }

        e.preventDefault();
    }

    function onDragStart(task) {
        draggedTaskRef.current = task;
    }

    function onEmptyColumnDrop(colIndex, statusId) {
        if(draggedTaskRef.current?.status.id !== statusId){
            props.onStatusChange(!draggedTaskRef.current, statusId);
        }
    }

    return (
        <Columns>
            {statuses.map((status, colIndex) => (
                <Column
                    key={status.id}
                    status={status}
                    tasks={props.tasks.filter(t => t.status.id === status.id)}
                    onDrop={(e, itemIndex) => onDrop(e, colIndex, itemIndex, status)}
                    onDragStart={(e, taskIndex, task) => onDragStart(task)}
                    onEmptyColumnDrop={(statusId) => onEmptyColumnDrop(colIndex, statusId)}
                    onModalOpen={props.onModalOpen}
                />
            ))}
        </Columns>
    );
}
