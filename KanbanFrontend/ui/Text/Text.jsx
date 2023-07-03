import * as S from "./Text.styled";

export function Text(props) {
    const { type = "body-1", indent = 0 } = props;

    return (
        <S.Text type={type} style={{ marginBottom: 4 * indent, ...props.style }}>
            {props.children}
        </S.Text>
    );
}
