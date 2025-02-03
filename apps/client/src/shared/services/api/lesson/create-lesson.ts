import { api } from "..";
import { CreateLessonDto } from "../../../../core/interfaces/create-lesson.dto";
import { LessonDto } from "../../../../core/interfaces/lesson.dto";

export async function createLesson(dto: CreateLessonDto) {
  const { data } = await api.post<LessonDto>("/api/lesson/", dto);
  return data;
}
