import { useEffect, useState, type RefObject } from 'react';

export const useIsSingleLine = <T extends HTMLElement | null>(
    ref: RefObject<T>,
    text: string
) => {
    const [isSingleLine, setIsSingleLine] = useState(true);

    useEffect(() => {
        if (ref.current) {
            setIsSingleLine(ref.current.scrollHeight <= ref.current.clientHeight);
        }
    }, [text, ref]);

    return isSingleLine;
};
