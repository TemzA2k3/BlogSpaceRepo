import { useState } from "react";

import { HeaderNavLinks } from "./HeaderNavLinks";
import { ToggleTheme } from "./ToogleTheme";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { LoggedUserPreview } from "./LoggedUserPreview";
import { Button } from "../shared/components/Button";


export const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <header className="flex px-10 py-3 justify-between items-center self-stretch border-b border-[#E5E8EB]">
      <div className="flex justify-between w-full">
        <HeaderNavLinks />
        <div className="flex items-center gap-4">
          <ToggleTheme />
          <LanguageSwitcher />

          {/* Auth Section */}
          {isLoggedIn ? (
            <LoggedUserPreview setIsLoggedIn={() => setIsLoggedIn(false)} />
          ) : (

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setIsLoggedIn(true)}>
                Login
              </Button>

              <Button variant="primary">Sign Up</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
