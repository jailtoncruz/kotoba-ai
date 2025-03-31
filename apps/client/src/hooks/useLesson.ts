// src/hooks/useLessons.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listLessons, createLesson } from "@services/api/lesson";

export const useLessonsQuery = () => {
  return useQuery({
    queryKey: ["lessons"],
    queryFn: listLessons,
  });
};

export const useCreateLessonMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLesson,
    onSuccess: () => {
      // Refetch lessons after a new lesson is created
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });
};
