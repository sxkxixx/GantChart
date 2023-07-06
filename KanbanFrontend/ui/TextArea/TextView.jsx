import { Text } from "../Text/Text";
import * as S from "./TextArea.styled";

export function TextView(props) {
    return (
        <S.TextView>
            <Text type="description-5">{props.value}</Text>
        </S.TextView>
    );
}
