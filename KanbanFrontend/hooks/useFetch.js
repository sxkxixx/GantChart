import { useEffect, useReducer, useRef } from "react";

function useFetch(url) {
    const cache = useRef({});

    const cancelRequest = useRef(false);

    const initialState= {
        error: undefined,
        data: undefined,
    };

    const fetchReducer = (state, action) => {
        switch (action.type) {
            case "loading":
                return { ...initialState };
            case "fetched":
                return { ...initialState, data: action.payload };
            case "error":
                return { ...initialState, error: action.payload };
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(fetchReducer, initialState);

    useEffect(() => {
        if (!url) return;

        cancelRequest.current = false;

        const fetchData = async () => {
            dispatch({ type: "loading" });

            if (cache.current[url]) {
                dispatch({ type: "fetched", payload: cache.current[url] });
                return;
            }

            try {
                setTimeout(async () => {
                    const response = await fetch(url, options);
                    if (!response.ok) {
                        throw new Error(response.statusText);
                    }

                    const data = (await response.json());
                    cache.current[url] = data;
                    if (cancelRequest.current) return;

                    dispatch({ type: "fetched", payload: data });
                }, 6000);
            } catch (error) {
                if (cancelRequest.current) return;

                dispatch({ type: "error", payload: error});
            }
        };

        void fetchData();

        return () => {
            cancelRequest.current = true;
        };
    }, [url]);

    return {
        ...state,
        setData(data) {
            dispatch({ type: "fetched", payload: data });
        },
    };
}

export default useFetch;
