import { CSSTransition } from "react-transition-group";
import styled from "styled-components";

export function TaskLoader() {
    return (
        <CSSTransition timeout={100}>
            <Loader>Загрузка...</Loader>
        </CSSTransition>
    );
}

const Loader = styled.h1`
    opacity: 0;

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
