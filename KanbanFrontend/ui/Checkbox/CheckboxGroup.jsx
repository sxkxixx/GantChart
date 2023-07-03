import React, { useState } from "react";
import * as S from "./CheckboxGroup.styled";

export function CheckboxGroup(props) {
    const [items, setItems] = useState([]);
    const { readonly = false } = props;

    return (
        <S.CheckboxGroup>
            {React.Children.map(props.children, (child, i) =>
                React.cloneElement(child, {
                    readonly,
                    checked: items.includes(props.children[i].props.value),
                    onToggle: (value) => {
                        const updated = [...items];
                        if (value) {
                            updated.push(props.children[i].props.value);
                        } else {
                            const index = updated.indexOf(props.children[i].props.value);
                            updated.splice(index, 1);
                        }
                        setItems(updated);
                        props.onChange(updated);
                    },
                })
            )}
        </S.CheckboxGroup>
    );
}
