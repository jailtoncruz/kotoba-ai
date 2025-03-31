import { Link, useNavigate } from "react-router-dom";
import { Button } from "@radix-ui/themes";
import logoReduced from "@assets/logo-reduced.svg";
import { HomeRoutes } from "@pages/home/home.routes";
import LanguageSwitcher from "@components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

function MenuItem({
  to,
  children,
}: {
  to: string;
  children?: React.ReactNode;
}) {
  return (
    <li>
      <Link to={to} className="text-gray-800 hover:text-gray-600">
        {children}
      </Link>
    </li>
  );
}

export function HomeLayout() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/sign-in");
  };

  return (
    <div className="min-h-screen flex flex-col text-gray-100">
      <header className="py-4 flex items-center justify-between max-w-[1200px] mx-auto w-full">
        <Link to="/home">
          <img src={logoReduced} alt="Kotoba AI logo" />
        </Link>
        <nav>
          <ul className="flex flex-row gap-4 items-center justify-center">
            <MenuItem to="/home/deck">Deck</MenuItem>
            <MenuItem to="/home/practice">Practice</MenuItem>
            <MenuItem to="/home/lessons">Lessons</MenuItem>
          </ul>
        </nav>
        <Button
          onClick={handleLogout}
          className="px-4 py-2 text-gray-100 rounded"
          color="red"
        >
          Logout
        </Button>
      </header>

      <main
        className="flex-grow flex flex-col flex-1 max-w-[1200px] mx-auto w-full"
        style={{ maxHeight: "calc(100vh - 76px)" }}
      >
        <HomeRoutes />
        <footer className="flex flex-col items-center justify-center gap-1 py-1 px-4">
          <div className="flex flex-row gap-4 items-center">
            🌐 <LanguageSwitcher />
          </div>
          <p className="font-montserrat text-sm text-center text-slate-800">
            {t("copyright.title")}
          </p>
        </footer>
      </main>
    </div>
  );
}
