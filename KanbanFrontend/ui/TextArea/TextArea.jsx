import { useSyncStates } from "@kanban/hooks/useSyncStates";
import * as S from "./TextArea.styled";

export function TextArea(props) {
    const [text, setText] = useSyncStates(props.value);

    return <S.TextArea placeholder={props.placeholder} onChange={(e) => setText(e.target.value)} value={text}></S.TextArea>;
}
