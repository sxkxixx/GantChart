import { Text } from "@kanban/ui/Text";
import { CheckMarkIcon } from "../icons";
import * as S from "./Checkbox.styled";
import { CloseItem } from "../icons/CloseItem";

export function Checkbox(props) {
    return (
        <div>
            <S.Label readonly={props.readonly}>
                <S.Input
                    hidden
                    type="checkbox"
                    checked={props.checked}
                    onChange={(e) => {
                        if (props.onToggle && !props.readonly) {
                            props.onToggle(e.target.checked);
                        }
                    }}
                />
                <S.CustomCheckboxWrapper>
                    <S.CustomCheckbox>
                        <CheckMarkIcon />
                    </S.CustomCheckbox>
                </S.CustomCheckboxWrapper>
                <div style={{backgroundColor: "white", padding: "4px 8px", border: "1px solid var(--basic-grey)", borderRadius: "4px"}}>
                    <Text type="description-8">{props.label}</Text>
                </div>
                <CloseItem></CloseItem>
            </S.Label>
        </div>
    );
}
