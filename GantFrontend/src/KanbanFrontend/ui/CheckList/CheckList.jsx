import React from "react";
import * as S from "../Checkbox/CheckboxGroup.styled";
import { CheckListItem } from "./CheckListItem";
import { PlusInsideBoxIcon } from "../icons";
import { Text } from "@kanban/ui/Text";

export const CheckList = (props) =>
{
    const handleChange = (stage, index) =>
    {
        const newStages = [...props.value];
        newStages[index] = stage;
        props.onChange(newStages);
    }

    const handleAdd = () =>
    {
        const newStages = [...props.value];
        newStages.push({ isCompleted: false, title: "" });
        props.onChange(newStages);
    }

    const handleRemove = (index) =>
    {
        const newStages = [...props.value];
        newStages.splice(index, 1);
        props.onChange(newStages);
    }

    return (
        <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <Text type="body-5">Чек лист</Text>
                <PlusInsideBoxIcon
                    onClick={handleAdd}
                    style={{ cursor: "pointer" }}
                />
            </div>
            <S.CheckboxGroup>
                {
                    props.value.map((stage, i) =>
                        <CheckListItem
                            isReadonly={props.isReadonly}
                            key={i}
                            stage={stage}
                            onChange={(stage) => handleChange(stage, i)}
                            onRemove={() => handleRemove(i)}
                        />)
                }
            </S.CheckboxGroup>
        </div>
    )
}
