import styled from "styled-components";

export const Task = styled.div`
    cursor: grab;
    transition: all 0.3s ease 0s;
    display: flex;
    flex-direction: column;
    gap: 20px;
    :hover {
        box-shadow: 0px 0px 10px rgba(40, 112, 255, 0.3);
    }
`;

export const Wrapper = styled.div`
    background-color: #ffffff;
    border-radius: 5px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
`;

export const TaskTitle = styled.h3`
    font-size: 18px;
    line-height: 20px;
    pointer-events: none;
`;

export const ProjectTitle = styled.p`
    background: #e7efff;
    border-radius: 5px;
    font-size: 16px;
    font-size: 14px;
    display: inline-block;
    line-height: 24px;
    padding: 0 8px;
    color: #2870ff;
    pointer-events: none;
`;

export const Tag = styled.p`
    background: #fef2e0;
    border-radius: 5px;
    font-size: 14px;
    line-height: 24px;
    display: inline-block;
    padding: 0 8px;
    color: #ee7900;
    pointer-events: none;
`;

export const Name = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    line-height: 16px;
    pointer-events: none;
    color: var(--basic-dark-grey);
`;

export const Date = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    line-height: 24px;
    display: flex;
    align-items: center;
    color: #313131;
    pointer-events: none;
`;

export const Footer = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
`;

export const Icons = styled.div`
    display: flex;
    gap: 8px;
`;
