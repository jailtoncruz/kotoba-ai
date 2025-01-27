import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";

export function CustomLessons() {
  const [lessons] = useState(["Lesson 1", "Lesson 2", "Lesson 3"]);
  const navigate = useNavigate();

  return (
    <div className="bg-gray-900 text-white flex flex-col flex-1">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Custom Lessons</h1>
        <Button onClick={() => navigate("create")}>New Custom Lesson</Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-4">
        {lessons.map((lesson, index) => (
          <div
            key={index}
            className="border p-4 cursor-pointer rounded bg-slate-800"
            onClick={() => navigate(index.toString())}
          >
            <div>
              <h2 className="font-semibold text-lg">{lesson}</h2>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                This is a placeholder description for {lesson}.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
