import { useCallback, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { CardPractice } from "./CardPractice";
import { api } from "../../../shared/services/api";

export interface Flashcard {
  id: string;
  hiragana: string;
  meaning: string;
  explanation?: string;
  audioUrl?: string;
}

export function Practice() {
  const [card, setCard] = useState<Flashcard | null>(null);
  const [isGeneratingCards, setIsGeneratingCards] = useState<boolean>(false);

  const navigate = useNavigate();

  const loadCard = useCallback(async () => {
    async function generateCards() {
      try {
        const { data } = await api.post<{ generatedCards: Flashcard[] }>(
          "/api/cards/generate",
          {
            complexity: 1,
            quantity: 10,
          }
        );
        if (data.generatedCards.length > 0) setIsGeneratingCards(false);
      } catch (_err) {
        const err = _err as AxiosError;
        console.log("generate error", err.message);
      } finally {
        loadCard();
      }
    }

    try {
      const { data } = await api.get<Flashcard>("/api/practice");
      setCard(data);
    } catch (_err) {
      const error = _err as AxiosError;
      console.error("Failed to load card:", error);
      if (error.response?.status === 401) {
        navigate("/sign-in");
      }
      if (error.response?.status === 404) {
        console.log("no cards");
        setIsGeneratingCards(true);
        generateCards();
      }
    }
  }, [navigate]);

  useEffect(() => {
    loadCard();
  }, [loadCard]);

  const handleQuitSession = () => {
    navigate("/home");
  };

  return (
    <div className="bg-gray-900 text-white flex flex-col flex-1">
      <header className="w-full bg-gray-800 shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Practice Session</h1>
        <button
          onClick={handleQuitSession}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
        >
          Quit Session
        </button>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        {!isGeneratingCards && card ? (
          <CardPractice card={card} onSubmitted={() => loadCard()} />
        ) : isGeneratingCards ? (
          <div>Generating new cards...</div>
        ) : (
          <p>Loading...</p>
        )}
      </main>
    </div>
  );
}
