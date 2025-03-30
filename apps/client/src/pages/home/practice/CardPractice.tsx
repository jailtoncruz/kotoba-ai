import { FiPlay, FiStopCircle } from "react-icons/fi";
import { convertToRomaji } from "../../../utils/hiragana-to-romaji";
import { Flashcard } from "./Practice";
import { ReviewCardOptions } from "./ReviewOptions";
import { useEffect, useState } from "react";
import { api } from "../../../services/api";

interface CardPracticeProps {
  card: Flashcard;
  onSubmitted: () => void;
}

export function CardPractice({ card, onSubmitted }: CardPracticeProps) {
  const [flipped, setFlipped] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleFlip = () => {
    setFlipped(!flipped);
    if (!flipped && audio) audio.play();
  };

  const handleReview = async (rating: number) => {
    if (!card) return;
    try {
      await api.post(`/api/practice/review/${card.id}`, { rating });
      onSubmitted();
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  const handlePlay = () => audio && audio.play();
  const handleStop = () => audio && audio.pause();

  useEffect(() => {
    return () => {
      audio?.pause();
    };
  }, [audio]);

  useEffect(() => {
    if (card) {
      setFlipped(false);
      if (card.audioUrl) {
        const newAudio = new Audio(card.audioUrl);
        setAudio(newAudio);
        newAudio.onplay = () => setIsPlaying(true);
        newAudio.onpause = () => setIsPlaying(false);
      }
    }
  }, [card]);

  return (
    <div className="w-full max-w-md">
      <div
        className={`relative w-full h-64 perspective cursor-pointer`}
        onClick={handleFlip}
      >
        <div
          className={`absolute inset-0 transform transition-transform  ${
            flipped ? "animate-flip" : "animate-unflip"
          }`}
        >
          {/* Front Side */}
          {!flipped && (
            <div className="absolute inset-0 bg-gray-800 rounded-lg shadow-md flex items-center justify-center">
              <p className="text-4xl font-bold">{card.hiragana}</p>
            </div>
          )}
          {/* Back Side */}
          {flipped && (
            <div className="absolute inset-0 bg-gray-700 rounded-lg shadow-md flex flex-col items-center justify-center text-center scale-x-[-1]">
              <p className="text-2xl font-bold">{card.hiragana}</p>
              <p className="italic text-lg">{convertToRomaji(card.hiragana)}</p>
              <p className="mt-2">{card.meaning}</p>
              {card.explanation && (
                <p className="text-sm mt-4">{card.explanation}</p>
              )}
            </div>
          )}
        </div>
      </div>
      {flipped && (
        <>
          {card.audioUrl && (
            <div className="flex flex-col items-center justify-center py-4">
              <button
                onClick={handlePlay}
                className={isPlaying ? "hidden" : "visible"}
              >
                <FiPlay className="text-3xl text-gray-600 hover:text-gray-800" />
              </button>
              <button
                onClick={handleStop}
                className={!isPlaying ? "hidden" : "visible"}
              >
                <FiStopCircle className="text-3xl text-gray-600 hover:text-gray-800" />
              </button>
            </div>
          )}
          <ReviewCardOptions handleReview={handleReview} />
        </>
      )}
    </div>
  );
}
