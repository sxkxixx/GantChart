import { useState } from "react";
import { useEffect } from "react";

export function useSyncStates(value) {
    const [state, setState] = useState(value);
    useEffect(() => {
        if (typeof value !== undefined && value !== state) {
            setState(value);
        }
    }, [value]);
    return [state, setState]
}
