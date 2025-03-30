import { useNavigate, useParams } from "react-router-dom";
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
import { Button, ScrollArea, Slider } from "@radix-ui/themes";
import { LessonLineDto } from "@typing/interfaces/lesson/lesson-line.dto";
import { getLessonById } from "@services/api/lesson";
import { LessonOptions } from "@features/lesson/LessonOptions";
import { LessonLine } from "./LessonLine";

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

    if (!selectedLine && lesson) onClickLine(lesson.lines[0]);

    if (audio) {
      const isPlaying = !audio.paused;

      if (isPlaying && !newState) {
        audio.pause();
      } else if (!isPlaying) {
        audio.play();
      }
    }
  };

  const onClickLine = useCallback(
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
    if (nextLine) onClickLine(nextLine);
  };

  const previousLine = () => {
    if (selectedLine) {
      const currentIndex = lesson?.lines.indexOf(selectedLine) ?? 1;
      const prevLine = lesson?.lines[Number(currentIndex - 1)];
      if (prevLine) onClickLine(prevLine);
    }
  };

  useEffect(() => {
    if (audio) {
      audio.onended = () => {
        if (isAutoNext) {
          const nextLine = getNextLine();
          if (nextLine) setTimeout(() => onClickLine(nextLine), nextAudioDelay);
          else {
            setSelectedLine(undefined);
            setIsAutoNext(false);
          }
        }
      };
    }
  }, [isAutoNext, audio, getNextLine, onClickLine, nextAudioDelay]);

  useEffect(() => {
    return function cleanup() {
      if (audio) audio.pause();
    };
  }, [audio]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div
      className="flex flex-col flex-1 m-4 gap-4"
      style={{
        maxHeight: "calc(100% - 92px)",
      }}
    >
      <div className="flex items-center justify-center gap-4">
        <button onClick={() => navigate("..")}>
          <FiChevronLeft size={28} color="black" />
        </button>

        <h1 className="text-xl font-bold flex-1 font-mochiy text-primary">
          {lesson?.title}
        </h1>

        <LessonOptions
          nextAudioDelay={nextAudioDelay}
          setNextAudioDelay={setNextAudioDelay}
        />
      </div>

      <ScrollArea type="hover" scrollbars="vertical" className="flex flex-1">
        <div className="flex flex-col flex-1 gap-6">
          {lesson?.lines.map((line) => (
            <LessonLine
              key={line.id}
              isSelected={selectedLine?.id === line.id}
              line={line}
              onClick={onClickLine}
            />
          ))}
        </div>
      </ScrollArea>

      <div className="border-t flex flex-row py-2 items-center text-slate-800">
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
