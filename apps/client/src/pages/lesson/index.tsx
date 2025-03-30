import { LessonList } from "@features/lesson/LessonList";
import { StudySession } from "@features/lesson/StudySession";
import { Route, Routes } from "react-router-dom";

export function Lesson() {
  return (
    <Routes>
      <Route path="" element={<LessonList />} />
      <Route path=":id" element={<StudySession />} />
    </Routes>
  );
}
