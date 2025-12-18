import { useEffect, useRef } from "react";

interface InfiniteObserverProps {
    /** Колбэк, когда якорь появился в зоне видимости */
    onIntersect: () => void;

    /** Включён ли observer */
    enabled?: boolean;

    /** Корневой элемент (scroll container), если null — viewport */
    root?: HTMLElement | null;

    /** Отступ для срабатывания (например "200px") */
    rootMargin?: string;

    /** Порог пересечения */
    threshold?: number;
}

export const InfiniteObserver = ({
    onIntersect,
    enabled = true,
    root = null,
    rootMargin = "0px",
    threshold = 0
}: InfiniteObserverProps) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const isFetchingRef = useRef(false);

    useEffect(() => {
        if (!enabled || !ref.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isFetchingRef.current) {
                    isFetchingRef.current = true;
                    onIntersect();
                }
            },
            { root, rootMargin, threshold }
        );

        observer.observe(ref.current);

        return () => observer.disconnect();
    }, [enabled, root, rootMargin, threshold, onIntersect]);

    useEffect(() => {
        if (!enabled) return;
        isFetchingRef.current = false;
    });

    return <div ref={ref} />;
};
