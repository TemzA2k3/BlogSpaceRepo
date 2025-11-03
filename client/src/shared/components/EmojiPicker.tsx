import { useRef, useEffect } from "react";
import { EMOJIS } from "@/shared/constants/emojis";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  show: boolean;
  onClose: () => void;
}

export const EmojiPicker = ({ onSelect, show, onClose }: EmojiPickerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      ref={ref}
      className="absolute top-full mt-2 right-0 w-48 max-h-48 overflow-y-auto bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 shadow-lg grid grid-cols-5 gap-2 z-50"
    >
      {EMOJIS.map((emoji, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(emoji)}
          className="text-lg hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};
