interface SearchInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string; // теперь можно передавать className
  }
  
  export const SearchInput = ({
    value,
    onChange,
    placeholder = "Поиск пользователей...",
    disabled = false,
    className = "",
  }: SearchInputProps) => {
    return (
      <div className="relative flex-1">
        <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`pl-10 w-full py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border-none
            ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
        />
      </div>
    );
  };
  