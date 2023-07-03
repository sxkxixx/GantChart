import styled from "styled-components";

export const Wrapper = styled.div`
    position: fixed;
    inset: 0;
    z-index: 2;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 100px 0;
    overflow: auto;

    transition: all 0.3s ease 0s;
    opacity: 1;

    &.enter-active {
        opacity: 1;
    }
    &.enter-done {
        opacity: 1;
    }
    &.exit-active {
        opacity: 0;
    }
    &.exit-done {
        opacity: 0;
    }
`;

export const Content = styled.div`
    max-width: 710px;
    margin: 0 auto;
    min-height: 100%;
    background-color: var(--basic-background);
    border-radius: 5px;
    padding: 16px 80px 32px 24px;
`;

export const Body = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const Comments = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const Title = styled.h3`
    padding: 8px 0;
    color: #000000;
    margin-bottom: 4px;
`;

export const BaseTask = styled.p`
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    margin-bottom: 8px;
    color: #000000;

    span {
        text-decoration: underline;
    }
`;

export const Status = styled.p`
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    color: rgba(0, 0, 0, 0.8);
`;

export const Subtitle = styled.h4`
    font-size: 14px;
    line-height: 16px;
    color: #000000;
    margin-bottom: 4px;
`;

export const Field = styled.div`
    padding: 0 8px;
    background: #ffffff;
    border: 1px solid #afbac3;
    border-radius: 5px;
    display: flex;
    align-items: center;
    gap: 8px;
    width: ${({ width }) => width}px;
`;

export const Inline = styled.div`
    display: flex;
    gap: 8px;
    justify-content: space-between;
`;

export const TimerWrapper = styled.div`
    display: flex;
    gap: 16px;
`;

export const TaskButtons = styled.div`
    display: flex;
    gap: 8px;
`;

export const AnimatedButton = styled.div`
    transition: all 0.3s ease 0s;
    transform: translateY(-20px);
    opacity: 0;

    &.enter-active {
        transform: translateY(0);
        opacity: 1;
    }
    &.enter-done {
        transform: translateY(0);
        opacity: 1;
    }
`;
