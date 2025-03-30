import { LessonDto } from "@typing/interfaces/lesson/lesson.dto";
import { FiPlay } from "react-icons/fi";
import { Link } from "react-router-dom";

interface HomeLessonLineProps {
  lesson: LessonDto;
}

export function HomeLessonLine({ lesson }: HomeLessonLineProps) {
  return (
    <Link to={`/home/lessons/${lesson.id}`} key={lesson.id}>
      <div className="flex flex-row justify-between items-center font-montserrat">
        <p className="font-bold text-slate-800 text-sm ">{lesson.title}</p>
        <p className="font-bold text-xs text-slate-700">completed</p>
      </div>
      <div className="flex flex-row justify-between gap-4 items-center">
        <p className="text-sm text-black overflow-hidden text-ellipsis line-clamp-2 max-h-16">
          {lesson.description}
        </p>

        <div className="w-6 h-6 p-[6px] flex justify-center items-center bg-blue-500 hover:bg-blue-400 transition-colors rounded-full cursor-pointer">
          <FiPlay
            size={16}
            color="white"
            style={{
              fill: "white",
            }}
          />
        </div>
      </div>
    </Link>
  );
}
