export function PlusIcon() {
    return (
        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width={32} height={32}>
            <line
                style={{ fill: "none", stroke: "#000", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2 }}
                x1="16"
                x2="16"
                y1="7"
                y2="25"
            />
            <line
                style={{ fill: "none", stroke: "#000", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2 }}
                x1="7"
                x2="25"
                y1="16"
                y2="16"
            />
        </svg>
    );
}
