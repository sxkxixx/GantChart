import React from "react";
import * as S from "../Checkbox/Checkbox.styled";
import { Input } from "../TextField/TextField.styled";
import { CheckMarkIcon } from "../icons";
import { CloseItem } from "../icons/CloseItem";

export const CheckListItem = (props) =>
{
    const handleCheckbox = (e) =>
    {
        props.onChange({
            ...props.stage,
            isCompleted: e.currentTarget.checked,
        });
    }

    const handleText = (e) =>
    {
        props.onChange({
            ...props.stage,
            title: e.currentTarget.value,
        });
    }
    return (
        <div>
            <S.Label readonly={props.isReadonly}>
                <S.Input
                    hidden
                    type="checkbox"
                    disabled={props.isReadonly}
                    checked={props.stage.isCompleted}
                    onChange={handleCheckbox}
                />
                <S.CustomCheckboxWrapper>
                    <S.CustomCheckbox>
                        <CheckMarkIcon />
                    </S.CustomCheckbox>
                </S.CustomCheckboxWrapper>
                <Input value={props.stage.title} onChange={handleText} style={{ width: "min-content" }} />
                <CloseItem onClick={props.onRemove}></CloseItem>
            </S.Label>
        </div>
    )
}
