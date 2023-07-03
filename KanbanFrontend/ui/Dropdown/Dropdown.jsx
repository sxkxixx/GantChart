import { useState } from "react";

import { CSSTransition } from "react-transition-group";
import * as S from "./Dropdown.styled";
import { useRef } from "react";
import { useOnClickOutside } from "@kanban/hooks/useOnClickOutside";
import { ArrowIcon } from "@kanban/ui/icons/Arrow";

export function Dropdown(props) {
    const { closeAfterSelect = true } = props;
    const [isOpen, setIsOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(
        props.selectFirst && props.data.length !== 0 ? props.idAccessor(props.data[0]) : null
    );

    const mainRef = useRef(null);
    const valuesRef = useRef(null);
    useOnClickOutside(mainRef, () => setIsOpen(false));

    const selectedItem = props.data.find((x) => props.idAccessor(x) === selectedId);

    function onSelect(item) {
        setSelectedId(props.idAccessor(item));
        props.onSelect(item);
        if (closeAfterSelect) setIsOpen(false);
    }

    return (
        <S.Main ref={mainRef} style={{ width: props.width }}>
            <S.StyledSelect onClick={() => setIsOpen(!isOpen)} active={isOpen} style={props.style}>
                <S.IconWrapper>
                    <>
                        {props.icon}
                        {selectedId && selectedItem
                            ? props.selectedConverter(selectedItem)
                            : props.placeholderConverter(props.placeholder)}
                    </>
                </S.IconWrapper>
                <ArrowIcon style={{ transitionDuration: ".3s", transform: `rotate3d(1, 0, 0, ${isOpen ? 180 : 0}deg` }} />
            </S.StyledSelect>
            <CSSTransition timeout={300} in={isOpen} unmountOnExit nodeRef={valuesRef}>
                <S.Values height={props.data.length * 100} ref={valuesRef}>
                    {props.data.map((x) => (
                        <div onClick={() => onSelect(x)} key={props.idAccessor(x)}>
                            {props.dataConverter(x)}
                        </div>
                    ))}
                </S.Values>
            </CSSTransition>
        </S.Main>
    );
}
