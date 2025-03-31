import { useLessonsQuery } from "@hooks/useLesson";
import { ScrollArea, Separator } from "@radix-ui/themes";
import { FiPlay, FiPlayCircle } from "react-icons/fi";
import { Skeleton } from "@radix-ui/themes";
import { HomeLessonLine } from "@features/home/HomeLessonLine";

export function Home() {
  const { data: lessons, isLoading } = useLessonsQuery();

  return (
    <div
      className="flex flex-1 flex-col py-4"
      style={{
        maxHeight: "calc(100% - 64px)",
      }}
    >
      <h1 className="font-mochiy text-title uppercase text-2xl">
        Study your deck
      </h1>

      <div className="flex items-center justify-center">
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

      <div className="flex flex-row justify-between items-center my-4">
        <h1 className="font-mochiy text-title uppercase text-2xl">LESSONS</h1>
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
      <ScrollArea
        type="hover"
        scrollbars="vertical"
        className="flex flex-col gap-2 flex-1"
      >
        {isLoading ? (
          <>
            {Array.apply(0, Array(3)).map((_, i) => (
              <Skeleton className="h-12 w-full mb-4" key={i} />
            ))}
          </>
        ) : lessons?.length === 0 ? (
          <p>No lessons found.</p>
        ) : (
          lessons
            ?.slice(0, 5)
            .map((lesson) => <HomeLessonLine lesson={lesson} key={lesson.id} />)
        )}
      </ScrollArea>
    </div>
  );
}
