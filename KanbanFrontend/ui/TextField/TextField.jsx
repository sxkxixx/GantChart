import { useSyncStates } from "@kanban/hooks/useSyncStates";
import { Text } from "@kanban/ui/Text";
import * as S from "./TextField.styled";

export function TextField(props) {
    const [value, setValue] = useSyncStates(props.value);

    return (
        <div>
            {props.label && (
                <Text indent={2} type="body-5">
                    {props.label}
                </Text>
            )}
            <S.Input
                style={props.style}
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    props.onChange(e.target.value);
                }}
                placeholder={props.placeholder}
                onKeyDown={props.onKeyDown}
            />
        </div>
    );
}
