import { useState, type FC, type Dispatch, type SetStateAction } from "react";

interface ILoggedUserPreview {
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

export const LoggedUserPreview: FC<ILoggedUserPreview> = ({
  setIsLoggedIn,
}) => {
  const [user, setUser] = useState({
    name: "John Doe",
    avatar: "/placeholder.svg?height=32&width=32",
  });
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowUserDropdown(!showUserDropdown)}
        className="p-0 transition-transform duration-200 hover:scale-105"
      >
        <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center overflow-hidden shadow-md">
          {user.avatar ? (
            <img
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <i className="fas fa-user text-sm text-white"></i>
          )}
        </div>
      </button>
      {showUserDropdown && (
        <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-10 min-w-[140px] overflow-hidden animate-in slide-in-from-top-2 duration-200">
          <button className="w-full text-left px-4 py-3 text-sm flex items-center gap-3 font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-150">
            <i className="fas fa-user text-xs text-gray-600"></i>
            Profile
          </button>
          <button
            onClick={() => {
              setIsLoggedIn(false);
              setShowUserDropdown(false);
            }}
            className="w-full text-left px-4 py-3 text-sm flex items-center gap-3 font-medium text-red-600 hover:bg-red-50 transition-colors duration-150"
          >
            <i className="fas fa-sign-out-alt text-xs"></i>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};
