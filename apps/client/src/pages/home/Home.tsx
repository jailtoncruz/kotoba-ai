import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token from localStorage and redirect to login
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const startPracticeSession = () => {
    navigate("/home/practice");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Welcome to Flashcards App</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      <main className="flex-grow flex items-center justify-center">
        <button
          onClick={startPracticeSession}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg hover:bg-blue-600"
        >
          Practice now
        </button>
      </main>
    </div>
  );
}