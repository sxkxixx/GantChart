import styled from "styled-components";

export const Label = styled.label`
    display: flex;
    gap: 8px;
    align-items: center;
    cursor: ${({ readonly }) => (readonly ? "auto" : "pointer")};
`;

export const Input = styled.input`
    &:checked + div > div {
        opacity: 1;
    }
`;

export const CustomCheckboxWrapper = styled.div`
    width: 16px;
    height: 16px;
    border: 2px solid var(--basic-grey);
    border-radius: 5px;
`;

export const CustomCheckbox = styled.div`
    background-color: var(--support-green);
    padding: 2px;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease 0s;
    opacity: 0;
`;
