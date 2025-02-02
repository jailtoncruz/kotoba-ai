import { LessonLineDto } from "./lesson-line.dto";

export interface LessonDto {
  id: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string;
  observations?: string;
  authorId: string;
}

export interface LessonWithLinesDto {
  id: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string;
  observations?: string;
  authorId: string;
  lines: LessonLineDto[];
}
