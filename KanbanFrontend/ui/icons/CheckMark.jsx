import { SvgWrapper } from "./SvgWrapper";

export function CheckMarkIcon(props) {
    return (
        <SvgWrapper
            viewBox="0 0 12 10"
            style={props.style}
            onClick={(e) => {
                e.stopPropagation();
                if (props.onClick) props.onClick();
            }}
        >
            <path d="M1.92432 5L4.47383 7.54951" stroke="white" strokeWidth="2" strokeLinecap="square" />
            <path d="M4.52429 7.60001L10.0435 2.08081" stroke="white" strokeWidth="2" strokeLinecap="square" />
        </SvgWrapper>
    );
}
