import { useState } from "react";
import { useTranslation } from "react-i18next";

import { HeaderNavLinks } from "./HeaderNavLinks";
import { ToggleTheme } from "./ToogleTheme";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Notifications } from "./Notifications";
import { LoggedUserPreview } from "./LoggedUserPreview";
import { Button } from "../shared/components/Button";
import { Link } from "react-router-dom";


export const Header = () => {
  const { t } = useTranslation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <header className="flex px-10 py-3 justify-between items-center self-stretch border-b border-[#E5E8EB]">
      <div className="flex justify-between w-full">
        <HeaderNavLinks />
        <div className="flex items-center gap-4">
          <ToggleTheme />
          <LanguageSwitcher />
          <Notifications />
          {isLoggedIn ? (
            <LoggedUserPreview setIsLoggedIn={() => setIsLoggedIn(false)} />
          ) : (
            <div className="flex gap-3">
                <Link to="/signin">
                    <Button variant="secondary">
                        {t("header.signIn")}
                    </Button>
                </Link>
              
                <Link to='/signup'>
                    <Button variant="primary">
                        {t("header.signUp")}
                    </Button>
                </Link>
              
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
