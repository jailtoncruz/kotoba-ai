import { useParams } from "react-router-dom";
import { getLessonById } from "../../../../shared/services/api/lesson";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { FiPlayCircle, FiStopCircle } from "react-icons/fi";
import { LessonLineDto } from "../../../../core/interfaces/lesson-line.dto";
import { Form } from "radix-ui";

export function StudySession() {
  const { id } = useParams<{ id: string }>();
  const [selectedLine, setSelectedLine] = useState<LessonLineDto | undefined>();
  const [isAutoNext, setIsAutoNext] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [nextAudioDelay, setNextAudioDelay] = useState<number>(500);

  const { data: lesson, isLoading } = useQuery({
    queryKey: ["lesson", id],
    queryFn: () => getLessonById(id!),
  });

  const getNextLine = useCallback(() => {
    if (!selectedLine) return lesson?.lines[0];
    const currentIndex = lesson?.lines.indexOf(selectedLine);
    const nextLine = lesson?.lines[Number(currentIndex) + 1];
    return nextLine;
  }, [selectedLine, lesson?.lines]);

  const togglePlay = () => {
    setIsAutoNext(!isAutoNext);
    if (!selectedLine) setSelectedLine(getNextLine());
    if (audio) {
      const isPlaying = !audio.paused;
      if (isPlaying) {
        audio.pause();
      } else if (!isPlaying) {
        audio.play();
      }
    }
  };

  const onLineClick = useCallback(
    (line: LessonLineDto) => {
      setSelectedLine(line);

      if (audio) audio.pause();

      const el = document.getElementById(line.id);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });

      if (line.audioUrl) {
        const newAudio = new Audio(line.audioUrl);
        setAudio(newAudio);
        newAudio.play();
      }
    },
    [audio]
  );

  useEffect(() => {
    if (audio) {
      audio.onended = () => {
        if (isAutoNext) {
          const nextLine = getNextLine();
          if (nextLine?.id)
            setTimeout(() => onLineClick(nextLine), nextAudioDelay);
        }
      };
    }
  }, [isAutoNext, audio, getNextLine, onLineClick, nextAudioDelay]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="bg-gray-900 text-white flex flex-col flex-1 m-4 gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">{lesson?.title}</h1>
        <Form.Root className="space-y-4">
          <Form.Field name="delay" className="flex flex-row items-center gap-2">
            <Form.Label className="block text-gray-300">Delay</Form.Label>
            <Form.Control asChild>
              <input
                type="number"
                value={nextAudioDelay}
                onChange={(e) => setNextAudioDelay(Number(e.target.value))}
                required
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring focus:border-blue-500"
              />
            </Form.Control>
          </Form.Field>
        </Form.Root>
      </div>

      <div
        className="flex flex-col flex-1 gap-4 overflow-y-auto overflow-x-hidden"
        style={{
          maxHeight: "calc(100vh - 220px)",
        }}
      >
        {lesson?.lines.map((line) => (
          <div
            key={line.id}
            onClick={() => onLineClick(line)}
            className="cursor-pointer flex-wrap"
            id={line.id}
          >
            <p
              className={`transition-all text-2xl relative max-w-[700px] ${
                selectedLine?.id === line.id
                  ? "scale-125 text-white left-[89px]"
                  : "text-gray-400 left-0"
              }`}
            >
              {line.text}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t flex flex-row justify-center py-2">
        {isAutoNext ? (
          <FiStopCircle
            size={32}
            onClick={togglePlay}
            className="cursor-pointer"
          />
        ) : (
          <FiPlayCircle
            size={32}
            onClick={togglePlay}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
}
