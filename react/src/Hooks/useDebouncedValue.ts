import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, debounceTime: number) {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedValue(p => value);
        }, debounceTime)

        return () => {
            clearTimeout(timeout);
        }
    }, [value])

    return debouncedValue;
}