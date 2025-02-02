import { Constants } from "@monorepo/shared";

export interface LessonLineDto {
  id: string;
  lessonId: string;
  order: number;
  languageCode: Constants.LanguageCode;
  text: string;
  audioUrl: string;
  createdAt: Date;
  updatedAt: Date;
}
