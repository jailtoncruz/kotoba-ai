import { api } from "..";
import { LessonDto } from "../../../../core/interfaces/lesson.dto";

export async function listLessons() {
  const { data } = await api.get<LessonDto[]>("/api/lesson/");
  return data;
}
