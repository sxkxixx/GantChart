import styled, { css } from "styled-components";

export const Main = styled.div`
    position: relative;
    width: 248px;
`;

export const Placeholder = styled.div`
    color: var(--basic-grey);
`;

export const Values = styled.div`
    position: absolute;
    left: 0;
    padding-top: 0px;
    top: 100%;
    width: 100%;
    background-color: #ffffff;
    border-radius: 5px;
    opacity: 0;
    height: calc(${({ height }) => height}% + 12px);
    overflow: hidden;
    transition: all 0.3s ease 0s;
    z-index: 2;

    &.enter-active {
        opacity: 1;
        padding-top: 8px;
    }

    &.enter-done {
        opacity: 1;
        padding-top: 8px;
    }

    &.exit-active {
        height: 0%;
    }

    &.exit-done {
        height: 0%;
    }
`;

export const StyledSelect = styled.div<{ active: boolean }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 0px 16px;
    position: relative;
    z-index: 1;
    transition: all 0.3s ease 0s;

    ${({ active }) =>
    active
        ? css`
                  border: 1px solid var(--primary-blue-8);
                  box-shadow: 0px 0px 0px 2px rgba(0, 76, 227, 0.2);
              `
        : ""}

    background-color: #ffffff;
    border: 1px solid var(--basic-grey);
    border-radius: 5px;
`;

export const IconWrapper = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
`;
