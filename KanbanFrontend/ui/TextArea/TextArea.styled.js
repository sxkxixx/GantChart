import styled from "styled-components";

export const TextArea = styled.textarea`
    resize: none;
    width: 100%;
    min-height: 128px;
    border: 1px solid var(--basic-grey);
    border-radius: 5px;
    background-color: var(--basic-white);
    padding: 16px;
    color: var(--basic-dark-grey);

    &:focus {
        outline: 0;
    }
`;

export const TextView = styled.div`
    width: 100%;
    min-height: 128px;
    border: 1px solid var(--basic-grey);
    border-radius: 5px;
    background-color: var(--basic-white);
    padding: 16px;
    color: var(--basic-dark-grey);
`;
