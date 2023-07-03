import styled from "styled-components";

const SelectText = styled.div`
    color: #565656;
`;

const Value = styled.div`
    padding: 8px 16px;
    cursor: pointer;
    color: #565656;
    transition: all 0.3s ease 0s;

    :hover {
        background: var(--primary-blue-0);
    }
`;

const createTaskBase = styled.div`
    cursor: pointer;
    color: #565656;
    padding-block: 6.5px;
`;

const selectedCreteTask = styled(createTaskBase)``;

const createTaskValue = styled(createTaskBase)`
    padding-inline: 16px;

    :hover {
        background: var(--primary-blue-0);
    }
`;

export const DropdownConverter = {
    Selected: {
        Header: SelectText,
        CreateTask: selectedCreteTask,
    },
    Data: {
        Header: Value,
        CreateTask: createTaskValue,
    },
};
