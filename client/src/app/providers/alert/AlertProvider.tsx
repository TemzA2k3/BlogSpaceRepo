// AlertProvider.tsx
import { createContext, useContext, useState, type FC, type ReactNode } from "react";
import { Alert } from "../../../shared/components/Alert";

type AlertContextType = {
  showAlert: (message: string, type?: "success" | "error" , duration?: number) => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

type AlertProviderProps = { children: ReactNode };

export const AlertProvider: FC<AlertProviderProps> = ({ children }) => {
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error"; duration: number } | null>(null);

  const showAlert = (message: string, type: "success" | "error" = "success", duration = 4000) => {
    setAlert({ message, type, duration });
  };

  const handleClose = () => {
    setAlert(null);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && <Alert message={alert.message} type={alert.type} duration={alert.duration} onClose={handleClose} />}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error("useAlert must be used within an AlertProvider");
  return context;
};
