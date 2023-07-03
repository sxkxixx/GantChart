import { SvgWrapper } from "./SvgWrapper";

export function ArrowIcon(props) {
    return (
        <SvgWrapper
            viewBox="0 0 14 8"
            style={props.style}
            onClick={(e) => {
                e.stopPropagation();
                if (props.onClick) props.onClick();
            }}
        >
            <path
                d="M13.44 1.83334L7.43999 7.16667C7.18832 7.38777 6.81166 7.38777 6.55999 7.16667L0.559988 1.83334C0.302598 1.58612 0.285557 1.18004 0.521327 0.912119C0.757098 0.644198 1.16204 0.609472 1.43999 0.83334L6.99999 5.77334L12.56 0.83334C12.7368 0.663544 12.9925 0.60445 13.2258 0.679459C13.4592 0.754469 13.6325 0.951483 13.6773 1.19248C13.722 1.43348 13.6309 1.67959 13.44 1.83334Z"
                fill="#231F20"
            />
        </SvgWrapper>
    );
}
