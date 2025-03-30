import { useLessonsQuery } from "@hooks/useLesson";
import { Separator } from "@radix-ui/themes";
import { FiPlay, FiPlayCircle } from "react-icons/fi";
import { Skeleton } from "@radix-ui/themes";
import { Link } from "react-router-dom";

export function Home() {
  const { data: lessons, isLoading } = useLessonsQuery();

  return (
    <div className="flex flex-1 flex-col px-14 py-4 max-w-[900px] mx-auto w-full">
      <h1 className="font-mochiy text-title uppercase text-2xl">
        Study your deck
      </h1>

      <div>
        <div className="bg-white border-2 border-primary rounded-lg h-48 w-96 my-8 flex flex-col px-4 py-2">
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="font-noto text-7xl text-slate-800">わたし</p>
          </div>
          <div className="flex flex-row justify-between items-center">
            <p className="text-slate-800">I (Me)</p>
            <FiPlayCircle size={32} color="red" />
          </div>
        </div>
      </div>

      <Separator size="4" />

      <div className="flex flex-row justify-between items-center">
        <h1 className="font-mochiy text-title uppercase text-2xl mt-8">
          LESSONS
        </h1>
        <div className="flex flex-row justify-between items-center gap-4">
          <p className="text-purple-600 font-montserrat font-semibold">
            Resume last lesson
          </p>

          <FiPlay
            size={32}
            color="white"
            className="bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-400 transition-colors"
            style={{
              fill: "white",
            }}
          />
        </div>
      </div>
      <div className="flex flex-col my-4 gap-2">
        {isLoading ? (
          <>
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-12 w-full mb-4" />
          </>
        ) : lessons?.length === 0 ? (
          <p>No lessons found.</p>
        ) : (
          lessons?.slice(0, 4).map((lesson) => (
            <Link to={`/home/lessons/${lesson.id}`} key={lesson.id}>
              <div className="flex flex-row justify-between items-center font-montserrat">
                <p className="font-bold text-slate-800 text-sm ">
                  {lesson.title}
                </p>
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
          ))
        )}
      </div>
    </div>
  );
}
