import { Route, Routes } from "react-router-dom";
import { Deck } from "./deck";
import { Practice } from "./practice/Practice";
import { LessonsRoutes } from "./custom-lessons/lessons.routes";
import { Home } from ".";

export function HomeRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="practice" element={<Practice />} />
      <Route path="deck" element={<Deck />} />
      <Route path="lessons/*" element={<LessonsRoutes />} />
    </Routes>
  );
}
