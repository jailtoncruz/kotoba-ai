import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Button } from "@radix-ui/themes";
import logoReduced from "@assets/logo-reduced.svg";
import { Menu } from "@pages/home/Menu";
import { HomeRoutes } from "@pages/home/_home.routes";

export function HomeLayout() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/sign-in");
  };

  return (
    <div className="min-h-screen flex flex-col text-gray-100">
      <header className="p-4 flex items-center justify-between">
        <div className="flex flex-row gap-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-primary"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <img src={logoReduced} alt="Kotoba AI logo" />
        </div>
        <Button
          onClick={handleLogout}
          className="px-4 py-2 text-gray-100 rounded"
          color="red"
        >
          Logout
        </Button>
      </header>

      <div className="flex-grow flex">
        <Menu isMenuOpen={isMenuOpen} />

        <main
          className="flex-grow flex flex-col flex-1"
          style={{ maxHeight: "calc(100vh - 72px)" }}
        >
          <HomeRoutes />
        </main>
      </div>
    </div>
  );
}
