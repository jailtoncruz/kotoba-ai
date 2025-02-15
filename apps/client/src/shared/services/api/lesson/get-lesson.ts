import { api } from "..";
import { LessonWithLinesDto } from "../../../../core/interfaces/lesson.dto";

export async function getLessonById(id: string) {
  const { data } = await api.get<LessonWithLinesDto>(`/api/lesson/${id}`);
  return data;
}
