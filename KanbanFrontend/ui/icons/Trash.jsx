import { SvgWrapper } from "./SvgWrapper";

export function TrashIcon(props) {
    return (
        <SvgWrapper
            hoverColors={props.hoverColors}
            style={props.style}
            onClick={(e) => {
                e.stopPropagation();
                if (props.onClick) props.onClick();
            }}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.6667 5.33325H7.33333C6.22876 5.33325 5.33333 6.22868 5.33333 7.33325V8.66659C5.33333 9.03478 5.63181 9.33325 6 9.33325H6.66667V16.6666C6.66667 17.7712 7.5621 18.6666 8.66667 18.6666H15.3333C16.4379 18.6666 17.3333 17.7712 17.3333 16.6666V9.33325H18C18.3682 9.33325 18.6667 9.03478 18.6667 8.66659V7.33325C18.6667 6.22868 17.7712 5.33325 16.6667 5.33325ZM16 16.6666C16 17.0348 15.7015 17.3333 15.3333 17.3333H8.66667C8.29848 17.3333 8 17.0348 8 16.6666V9.33325H16V16.6666ZM6.66667 7.99992H17.3333V7.33325C17.3333 6.96506 17.0349 6.66659 16.6667 6.66659H7.33333C6.96514 6.66659 6.66667 6.96506 6.66667 7.33325V7.99992ZM9.33333 15.3333V11.3333C9.33333 10.9651 9.63181 10.6666 10 10.6666C10.3682 10.6666 10.6667 10.9651 10.6667 11.3333V15.3333C10.6667 15.7014 10.3682 15.9999 10 15.9999C9.63181 15.9999 9.33333 15.7014 9.33333 15.3333ZM13.3333 11.3333V15.3333C13.3333 15.7014 13.6318 15.9999 14 15.9999C14.3682 15.9999 14.6667 15.7014 14.6667 15.3333V11.3333C14.6667 10.9651 14.3682 10.6666 14 10.6666C13.6318 10.6666 13.3333 10.9651 13.3333 11.3333Z"
            />
        </SvgWrapper>
    );
}
