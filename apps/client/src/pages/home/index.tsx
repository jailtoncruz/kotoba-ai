import { useNavigate } from "react-router-dom";
import { HomeRoutes } from "./_home.routes";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Menu } from "./Menu";
import { Button } from "@radix-ui/themes";

export function Home() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/sign-in");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col text-gray-100">
      <header className="bg-gray-800 shadow p-4 flex items-center">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-100 mr-4"
        >
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        <h1 className="text-xl font-semibold flex-1">
          Welcome to Flashcards App
        </h1>
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
          style={{
            maxHeight: "calc(100vh - 72px)",
          }}
        >
          <HomeRoutes />
        </main>
      </div>
    </div>
  );
}
