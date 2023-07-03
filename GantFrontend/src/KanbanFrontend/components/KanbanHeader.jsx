import { kanbanApiContainer } from "@kanban/store/Api";
import { setExecutorFilter, setProjectFilter } from "@kanban/store/KanbanSlice";
import { Text } from "@kanban/ui/Text";
import { DropdownConverter } from "@kanban/utils/converters/DropdownConverter";
import { useState } from "react";
import styled from "styled-components";
import { useAppDispatch } from "../../../shared/src/store/Hooks";
import { Button } from "../ui/Button";
import { Dropdown } from "../ui/Dropdown";

const StyledHeader = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;
`;
const Selects = styled.div`
    display: flex;
    gap: 16px;
`;

export function KanbanHeader(props) {
    const dispatch = useAppDispatch();
    const projects = kanbanApiContainer.useGetProjectsQuery().data ?? [];

    const [project, setProject] = useState(null);
    const [executor, setExecutor] = useState(null);

    const handleSelectExecutor = (filter) => {
        setExecutor(filter);
        dispatch(setExecutorFilter(filter));
    };


    const handleSelectProject = (project) => {
        setProject(project);
        dispatch(setProjectFilter(project));
    };

    return (
        <StyledHeader>
            <Selects>
                <Dropdown
                placeholder="Фильтр по исполнителям"
                placeholderConverter={(p) => <Text type="description-4">{p}</Text>}
                data={["Все задачи", "Мои задачи"]}
                onSelect={(item) => handleSelectExecutor(item)}
                dataConverter={(item) => <DropdownConverter.Data.Header>{item}</DropdownConverter.Data.Header>}
                idAccessor={(item) => item}
                selectedConverter={(item) => <DropdownConverter.Selected.Header>{item}</DropdownConverter.Selected.Header>}
                selectedId={executor}
                />
                <Dropdown
                placeholder="Все проекты"
                placeholderConverter={(p) => <Text type="description-4">{p}</Text>}
                data={projects}
                onSelect={(item) => handleSelectProject(item)}
                dataConverter={(item) => <DropdownConverter.Data.Header>{item.name}</DropdownConverter.Data.Header>}
                idAccessor={(item) => item.id.toString()}
                selectedConverter={(item) => <DropdownConverter.Selected.Header>{item.name}</DropdownConverter.Selected.Header>}
                selectedId={`${project?.id ?? 0}`}
                />
            </Selects>
            <div style={{ display: "flex", gap: 8 }}>
                <Button variant="primary" onClick={props.createTask}>
                    Создать задачу
                </Button>
                <Button variant="primary" onClick={props.deleteCompletedTasks}>
                    Удалить завершенные задачи
                </Button>
            </div>
        </StyledHeader>
    );
}
