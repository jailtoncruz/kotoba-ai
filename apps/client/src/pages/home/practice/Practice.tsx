import { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { convertToRomaji } from "../../../shared/utils/hiragana-to-romaji";

interface Flashcard {
  id: string;
  hiragana: string;
  meaning: string;
  explanation?: string;
}

export function Practice() {
  const [card, setCard] = useState<Flashcard | null>(null);
  const [flipped, setFlipped] = useState(false);
  const navigate = useNavigate();

  const loadCard = useCallback(async () => {
    try {
      const { data } = await axios.get<Flashcard>("/api/practice", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setCard(data);
      setFlipped(false);
    } catch (_err) {
      const error = _err as AxiosError;
      console.error("Failed to load card:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  }, [navigate]);

  useEffect(() => {
    loadCard();
  }, [loadCard]);

  const handleFlip = () => setFlipped(!flipped);

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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header at the top of the page */}
      <header className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Practice Session</h1>
        <button
          onClick={handleQuitSession}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
        >
          Quit Session
        </button>
      </header>

      {/* Main content centered on the page */}
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        {card ? (
          <div className="w-full max-w-md">
            <div
              onClick={handleFlip}
              className={`relative w-full h-64 bg-white rounded-lg shadow-md flex items-center justify-center text-4xl font-bold cursor-pointer transition-transform transform ${flipped ? "rotate-y-180" : ""
                }`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {flipped ? (
                  <div className="text-center">
                    <p className="font-normal text-lg italic">{convertToRomaji(card.hiragana)}</p>
                    <p>{card.meaning}</p>
                    {card.explanation && <p className="text-sm mt-2">{card.explanation}</p>}
                  </div>
                ) : (
                  <p>{card.hiragana}</p>
                )}
              </div>
            </div>

            {flipped && (
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
            )}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </main>
    </div>
  );
}