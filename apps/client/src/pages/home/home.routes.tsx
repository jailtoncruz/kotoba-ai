import { Link, Route, Routes } from "react-router-dom";
import { Deck } from "./deck";
import { Practice } from "./practice/Practice";
import AuthGuard from "../../core/guards/AuthGuard";
import { LessonsRoutes } from "./custom-lessons/lessons.routes";

export function HomeRoutes() {
  return (
    <AuthGuard>
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex flex-col items-center justify-center h-full">
              <Link
                to="practice"
                className="px-6 py-3 bg-blue-600 text-gray-100 rounded-lg text-lg hover:bg-blue-700"
              >
                Practice now
              </Link>
            </div>
          }
        />
        <Route path="practice" element={<Practice />} />
        <Route path="deck" element={<Deck />} />
        <Route path="lessons/*" element={<LessonsRoutes />} />
      </Routes>
    </AuthGuard>
  );
}
