import type { ModalProps } from "../types/modal.types";

export const Modal = ({
    isOpen,
    onClose,
    children,
    width = "w-2/3",
    maxHeight = "max-h-[80vh]"
}: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg relative ${width} ${maxHeight} overflow-y-auto`}>
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                    onClick={onClose}
                >
                    ✕
                </button>

                {children}
            </div>
        </div>
    );
};
