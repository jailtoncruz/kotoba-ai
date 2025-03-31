import { api } from "..";
import { CreateLessonDto } from "../../../types/interfaces/lesson/create-lesson.dto";
import { LessonDto } from "../../../types/interfaces/lesson/lesson.dto";

export async function createLesson(dto: CreateLessonDto) {
  const { data } = await api.post<LessonDto>("/api/lesson", dto);
  return data;
}
