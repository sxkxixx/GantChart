import { PlusIcon } from "@kanban/ui/icons";
import styled from "styled-components";

const DropPlaceholder = styled.div`
    width: 100%;
    height: 200px;
    border: 2px dashed #333;
    pointer-events: none;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export function DndPlaceholder() {
    return (
        <DropPlaceholder>
            <PlusIcon />
        </DropPlaceholder>
    );
}
