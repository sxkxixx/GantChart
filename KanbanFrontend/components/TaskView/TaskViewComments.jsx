import * as S from "./TaskView.styled";
import { Text } from "@kanban/ui/Text";

export function TaskViewComments(props) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {props.comments.map((comment) => (
                <div key={comment.id}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <Text type="description-5">{comment.content}</Text>
                        <Text type="description-1">
                            {comment.time?.getHours().toString().padStart(2, "0")}:
                            {comment.time?.getMinutes().toString().padStart(2, "0")}
                        </Text>
                    </div>
                    <S.Field style={{ padding: "8px 16px" }}>
                        <Text type="description-5">{comment.content}</Text>
                    </S.Field>
                </div>
            ))}
        </div>
    );
}
