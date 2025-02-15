import { Route, Routes } from "react-router-dom";
import { CustomLessons } from ".";
import { StudySession } from "./study-session";

export function LessonsRoutes() {
  return (
    <Routes>
      <Route path="" element={<CustomLessons />} />
      <Route path=":id" element={<StudySession />} />
    </Routes>
  );
}
