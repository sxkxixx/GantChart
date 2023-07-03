import styled from "styled-components";

export const Input = styled.input`
    width: 100%;
    background: var(--basic-white);
    border: 1px solid var(--basic-grey);
    border-radius: 5px;
    height: 32px;
    padding: 8px 16px;

    &:focus {
        outline: 0;
    }

    &::placeholder {
        color: var(--basic-inactive);
    }
`;
