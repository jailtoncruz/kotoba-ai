import { api } from "..";
import { LessonDto } from "../../../types/interfaces/lesson/lesson.dto";

export async function listLessons() {
  await new Promise((resolve) => setTimeout(resolve, 1000 * 2));
  const { data } = await api.get<LessonDto[]>("/api/lesson/");
  return data;
}
