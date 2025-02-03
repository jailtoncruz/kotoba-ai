import { useNavigate, useParams } from "react-router-dom";
import { getLessonById } from "../../../../shared/services/api/lesson";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import {
  FiPlayCircle,
  FiStopCircle,
  FiChevronLeft,
  FiSkipBack,
  FiSkipForward,
  FiVolume2,
  FiVolume,
  FiAlignLeft,
} from "react-icons/fi";
import { LessonLineDto } from "../../../../core/interfaces/lesson-line.dto";
import { Form } from "radix-ui";
import { Button, Slider } from "@radix-ui/themes";

export function StudySession() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedLine, setSelectedLine] = useState<LessonLineDto | undefined>();
  const [isAutoNext, setIsAutoNext] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [nextAudioDelay, setNextAudioDelay] = useState<number>(500);
  const [volume, setVolume] = useState<number>(100);

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
    const newState = !isAutoNext;
    setIsAutoNext(newState);

    if (!selectedLine && lesson) onLineClick(lesson.lines[0]);

    if (audio) {
      const isPlaying = !audio.paused;

      if (isPlaying && !newState) {
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
        newAudio.volume = volume / 100;
        setAudio(newAudio);
        newAudio.play();
      }
    },
    [audio, volume]
  );

  const nextLine = () => {
    const nextLine = getNextLine();
    if (nextLine) onLineClick(nextLine);
  };

  const previousLine = () => {
    if (selectedLine) {
      const currentIndex = lesson?.lines.indexOf(selectedLine) ?? 1;
      const prevLine = lesson?.lines[Number(currentIndex - 1)];
      if (prevLine) onLineClick(prevLine);
    }
  };

  useEffect(() => {
    if (audio) {
      audio.onended = () => {
        if (isAutoNext) {
          const nextLine = getNextLine();
          if (nextLine) setTimeout(() => onLineClick(nextLine), nextAudioDelay);
          else {
            setSelectedLine(undefined);
            setIsAutoNext(false);
          }
        }
      };
    }
  }, [isAutoNext, audio, getNextLine, onLineClick, nextAudioDelay]);

  useEffect(() => {
    return function cleanup() {
      if (audio) audio.pause();
    };
  }, [audio]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="bg-gray-900 text-white flex flex-col flex-1 m-4 gap-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("..")}
          className="p-1 rounded-full border-2 border-gray-500 hover:bg-gray-700 transition-colors"
        >
          <FiChevronLeft size={24} color="#95a5a6" />
        </button>

        <h1 className="text-xl font-bold flex-1">{lesson?.title}</h1>
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

      <div className="border-t flex flex-row py-2 items-center">
        <div className="max-w-44 flex flex-row flex-1 items-center">
          <FiVolume size={24} />
          <Slider
            className="mr-2"
            value={[volume]}
            onValueChange={(e) => {
              const [value] = e;
              setVolume(value);
              if (audio) {
                audio.volume = value / 100;
              }
            }}
          />
          <FiVolume2 size={24} />
        </div>
        <div className="flex flex-1 flex-row items-center justify-center gap-4">
          <FiSkipBack
            size={40}
            className="cursor-pointer"
            onClick={previousLine}
          />

          {isAutoNext ? (
            <FiStopCircle
              size={40}
              onClick={togglePlay}
              className="cursor-pointer"
            />
          ) : (
            <FiPlayCircle
              size={40}
              onClick={togglePlay}
              className="cursor-pointer"
            />
          )}

          <FiSkipForward
            size={40}
            className="cursor-pointer"
            onClick={nextLine}
          />
        </div>

        <div className="flex flex-row items-center">
          <Button variant="outline">
            <FiAlignLeft size={24} />
            Playlist
          </Button>
        </div>
      </div>
    </div>
  );
}
