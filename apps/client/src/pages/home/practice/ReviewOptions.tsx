interface ReviewCardOptionsProps {
  handleReview: (difficulty: number) => void;
}

export function ReviewCardOptions({ handleReview }: ReviewCardOptionsProps) {
  return (
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
  );
}
