import { useEffect, useState, type FC } from "react";

import type { AlertProps } from "@/shared/types/alert.types";

export const Alert: FC<AlertProps> = ({
    message,
    type = "success",
    onClose,
    duration = 4000,
}) => {
    const [visible, setVisible] = useState(false);
    const [render, setRender] = useState(true);

    useEffect(() => {
        setVisible(true);

        const hideTimer = window.setTimeout(() => setVisible(false), duration);
        const removeTimer = window.setTimeout(() => {
            setRender(false);
            onClose();
        }, duration + 300);

        return () => {
            clearTimeout(hideTimer);
            clearTimeout(removeTimer);
        };
    }, [duration, onClose]);

    if (!render) return null;

    return (
        <div
            className={`
          fixed top-5 right-5 w-full max-w-sm flex transform transition-all duration-300
          backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 shadow-lg z-50
          ${type === "success" ? "text-green-900 dark:text-green-200" : "text-red-900 dark:text-red-200"}
          ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"}
        `}
            style={{ overflow: "hidden" }}
        >
            <div className={`absolute left-0 top-0 h-full w-1 ${type === "success" ? "bg-green-600" : "bg-red-600"}`}></div>
            <div className="flex-1 ml-3 p-5 break-words">{message}</div>
            <button
                onClick={() => setVisible(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors text-xl p-5"
            >
                &times;
            </button>
        </div>
    );
};

