import { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { FiPlay, FiStopCircle } from "react-icons/fi";
import { convertToRomaji } from "../../../shared/utils/hiragana-to-romaji";

interface Flashcard {
  id: string;
  hiragana: string;
  meaning: string;
  explanation?: string;
  audioUrl?: string;
}

export function Practice() {
  const [card, setCard] = useState<Flashcard | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGeneratingCards, setIsGeneratingCards] = useState<boolean>(false);

  const navigate = useNavigate();

  const loadCard = useCallback(async () => {
    async function generateCards() {
      try {
        const { data } = await axios.post<{ generatedCards: Flashcard[] }>("/api/cards/generate", {
          complexity: 1,
          quantity: 10
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (data.generatedCards.length > 0) setIsGeneratingCards(false);
      } catch (_err) {
        const err = _err as AxiosError;
        console.log('generate error', err.message)
      } finally {
        loadCard();
      }
    }

    try {
      const { data } = await axios.get<Flashcard>("/api/practice", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setCard(data);
      setFlipped(false);
      if (data.audioUrl) {
        const newAudio = new Audio(data.audioUrl);
        setAudio(newAudio);
        newAudio.onplay = () => setIsPlaying(true);
        newAudio.onpause = () => setIsPlaying(false);
        // newAudio.play();
      }
    } catch (_err) {
      const error = _err as AxiosError;
      console.error("Failed to load card:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
      if (error.response?.status === 404) {
        console.log('no cards')
        setIsGeneratingCards(true);
        generateCards();
      }
    }
  }, [navigate]);

  useEffect(() => {
    loadCard();
  }, [loadCard]);

  useEffect(() => {
    return () => {
      audio?.pause();
    };
  }, [audio]);

  const handleFlip = () => {
    setFlipped(!flipped);
    if (!flipped && audio) audio.play();
  };

  const handleReview = async (rating: number) => {
    if (!card) return;
    try {
      await axios.post(
        `/api/practice/review/${card.id}`,
        { rating },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      loadCard();
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  const handleQuitSession = () => {
    navigate("/home");
  };

  const handlePlay = () => audio && audio.play();
  const handleStop = () => audio && audio.pause();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Practice Session</h1>
        <button
          onClick={handleQuitSession}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
        >
          Quit Session
        </button>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        {(!isGeneratingCards && card) ? (
          <div className="w-full max-w-md">
            <div
              onClick={handleFlip}
              className={`relative w-full h-64 bg-white rounded-lg shadow-md flex items-center justify-center text-4xl font-bold cursor-pointer transition-transform transform ${flipped ? "rotate-y-180" : ""
                }`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {flipped ? (
                  <div className="text-center">
                    <p className="font-normal text-lg">{card.hiragana}</p>
                    <p className="font-normal text-lg italic">{convertToRomaji(card.hiragana)}</p>
                    <p>{card.meaning}</p>
                    {card.explanation && <p className="text-sm mt-2">{card.explanation}</p>}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center space-x-4">
                      <p>{card.hiragana}</p>
                    </div>
                  </>
                )}
              </div>
            </div>


            {flipped && (
              <>
                {card.audioUrl && (
                  <div className="flex flex-col items-center justify-center py-4">
                    <button onClick={handlePlay} className={isPlaying ? 'hidden' : 'visible'}>
                      <FiPlay className="text-3xl text-gray-600 hover:text-gray-800" />
                    </button>
                    <button onClick={handleStop} className={!isPlaying ? 'hidden' : 'visible'}>
                      <FiStopCircle className="text-3xl text-gray-600 hover:text-gray-800" />
                    </button>
                  </div>
                )}
                <div className="mt-6 flex flex-row gap-4">
                  <button
                    onClick={() => handleReview(0)}
                    className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    I don’t remember
                  </button>
                  <button
                    onClick={() => handleReview(1)}
                    className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  >
                    Hard
                  </button>
                  <button
                    onClick={() => handleReview(2)}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => handleReview(3)}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Easy
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          isGeneratingCards ? (
            <div>
              Generating new cards
            </div>
          ) : (<p>Loading...</p>)
        )}
      </main>
    </div>
  );
}