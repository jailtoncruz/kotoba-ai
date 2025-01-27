import { Route, Routes } from "react-router-dom";
import { CustomLessons } from ".";
import { CreateLessonForm } from "./create";

export function LessonsRoutes() {
  return (
    <Routes>
      <Route path="" element={<CustomLessons />} />
      <Route path="create" element={<CreateLessonForm />} />
      <Route path=":id" element={<div>Study</div>} />
    </Routes>
  );
}
