import { useLessonsQuery } from "@hooks/useLesson";
import { CreateLessonDialog } from "@features/lesson/CreateLessonDialog";
import { ScrollArea, Skeleton } from "@radix-ui/themes";
import { Link } from "react-router-dom";

export function LessonList() {
  const { data: lessons, isLoading } = useLessonsQuery();

  return (
    <div
      className="text-slate-800 flex flex-col flex-1 my-4"
      style={{
        maxHeight: "calc(100% - 92px)",
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold font-mochiy text-title">Lessons</h1>
        <CreateLessonDialog />
      </div>

      <ScrollArea
        type="hover"
        scrollbars="vertical"
        className="flex flex-col gap-4 flex-1"
      >
        {isLoading ? (
          <>
            {Array.apply(0, Array(5)).map((_, i) => (
              <Skeleton className="h-12 w-full mb-4" key={i} />
            ))}
          </>
        ) : lessons?.length === 0 ? (
          <p>No lessons found.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {lessons?.map((lesson) => {
              return (
                <Link
                  to={lesson.id}
                  key={lesson.id}
                  className="text-gray-800 p-4 rounded-md cursor-pointer border border-accent bg-white hover:bg-pink-100 transition-colors"
                >
                  <p className="font-semibold">{lesson.title}</p>
                  <p>{lesson.description}</p>
                </Link>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
