import { useState, useEffect, type ReactNode, type ChangeEvent, type FC } from "react";

type InputProps = {
  value?: string;
  onChange?: (value: string) => void;
  debounce?: number;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  placeholder?: string;
  className?: string;
  type?: string;
};

export const Input: FC<InputProps> = ({
  value = "",
  onChange,
  debounce,
  leftIcon,
  rightIcon,
  placeholder = "Введите текст...",
  className = "w-full",
  type = "text",
}) => {
  const [internalValue, setInternalValue] = useState<string>(value);

  useEffect(() => {
    if (debounce && onChange) {
      const handler = setTimeout(() => {
        onChange(internalValue);
      }, debounce);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [internalValue, debounce, onChange]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    if (!debounce && onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div
      className={`flex items-center border border-gray-300 rounded-xl bg-white px-3 py-2 shadow-sm transition ${className}`}
    >
      {leftIcon && <span className="mr-2 text-gray-400">{leftIcon}</span>}

      <input
        type={type}
        value={internalValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-1 outline-none bg-transparent text-gray-800 placeholder-gray-400 text-sm"
      />

      {rightIcon && <span className="ml-2 text-gray-400">{rightIcon}</span>}
    </div>
  );
}
