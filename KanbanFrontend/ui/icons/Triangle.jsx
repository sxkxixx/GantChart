import { SvgWrapper } from "./SvgWrapper";
export function TriangleIcon(props) {
    return (
        <SvgWrapper
            viewBox={24}
            style={props.style}
            onClick={(e) => {
                e.stopPropagation();
                if (props.onClick) props.onClick();
            }}
        >
            <path
                d="M9.15405 12.3852L12.4437 15.5378C12.5633 15.6524 12.7532 15.6484 12.8679 15.5288C12.9214 15.4729 12.9513 15.3986 12.9513 15.3212V8.72725C12.9513 8.56156 12.817 8.42725 12.6513 8.42725C12.5739 8.42725 12.4995 8.45713 12.4437 8.51065L9.15405 11.6632C8.95468 11.8543 8.94794 12.1708 9.13901 12.3702C9.14391 12.3753 9.14893 12.3803 9.15405 12.3852Z"
                fill="#31393C"
            />
        </SvgWrapper>
    );
}
