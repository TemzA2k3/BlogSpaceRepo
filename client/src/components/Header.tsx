import { Link } from "react-router-dom";


export const Header = () => {
  return (
    <header className="flex px-10 py-3 justify-between items-center self-stretch border-b border-[#E5E8EB]">
      <div className="flex justify-between">
        <div className="flex gap-8 items-center">
            <div className="flex gap-4 items-center">
                <img src={"zxc"} alt="logo"/>
                <div className="self-stretch justify-start text-neutral-900 text-lg font-bold leading-snug">BlogSpace</div>
            </div>
            <nav className="max-w-4xl mx-auto px-4 py-4 flex gap-4">
        <div className="inline-flex justify-start items-center gap-9">
          <div className="inline-flex flex-col justify-start items-start">
            <Link
              className="self-stretch justify-start text-neutral-900 text-sm font-medium leading-tight"
              to="/"
            >
              Home
            </Link>
          </div>
          <div className="inline-flex flex-col justify-start items-start">
            <Link
              className="self-stretch justify-start text-neutral-900 text-sm font-medium leading-tight"
              to="/"
            >
              Explore
            </Link>
          </div>
          <div className="inline-flex flex-col justify-start items-start">
            <Link
              className="self-stretch justify-start text-neutral-900 text-sm font-medium leading-tight"
              to="/"
            >
              Notifications
            </Link>
          </div>
          <div className="inline-flex flex-col justify-start items-start">
            <Link
              className="self-stretch justify-start text-neutral-900 text-sm font-medium leading-tight"
              to="/"
            >
              Messages
            </Link>
          </div>
        </div>
      </nav>

        </div>
        <div className=""></div>
      </div>
    </header>
  );
};
