import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CreateLessonDialog } from "./components/create";
import { listLessons } from "../../../services/api/lesson";

export function CustomLessons() {
  const { data: lessons, isLoading } = useQuery({
    queryKey: ["lessons"],
    queryFn: listLessons,
  });
  const navigate = useNavigate();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="bg-gray-900 text-white flex flex-col flex-1 m-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Custom Lessons</h1>
        <CreateLessonDialog />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {lessons?.map((lesson) => {
          return (
            <div
              key={lesson.id}
              className="bg-gray-800 p-4 rounded-md cursor-pointer"
              onClick={() => navigate(lesson.id)}
            >
              <p>{lesson.title}</p>
              <p>{lesson.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
