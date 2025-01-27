import React, { useState } from "react";
import { Form } from "radix-ui";
import { Button } from "../../../../components/ui/button";

interface CreateLessonDto {
  subject: string;
  lessonName: string;
  observation?: string;
}

export function CreateLessonForm() {
  const [lesson, setLesson] = useState<CreateLessonDto>({
    lessonName: "",
    subject: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Lesson Created:", lesson);
  };

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setLesson({
      ...lesson,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-gray-900 text-white flex flex-col flex-1 items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-4 bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
        <div>
          <h2 className="text-xl font-bold mb-4">Create a New Lesson</h2>
          <Form.Root onSubmit={handleSubmit} className="space-y-4">
            <Form.Field name="lessonName">
              <Form.Label className="block text-sm font-medium mb-1">
                Lesson Name
              </Form.Label>
              <Form.Control asChild>
                <input
                  type="text"
                  name="lessonName"
                  value={lesson.lessonName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter the lesson name"
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring focus:border-blue-500"
                />
              </Form.Control>
            </Form.Field>

            <Form.Field name="subject">
              <Form.Label className="block text-sm font-medium mb-1">
                Subject
              </Form.Label>
              <Form.Control asChild>
                <input
                  type="text"
                  name="subject"
                  value={lesson.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter the subject"
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring focus:border-blue-500"
                />
              </Form.Control>
            </Form.Field>

            <Form.Field name="observation">
              <Form.Label className="block text-sm font-medium mb-1">
                Observation (Optional)
              </Form.Label>
              <Form.Control asChild>
                <textarea
                  value={lesson.observation}
                  name="observation"
                  onChange={handleInputChange}
                  placeholder="Enter any observations (optional)"
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring focus:border-blue-500"
                />
              </Form.Control>
            </Form.Field>
            <Button type="submit" className="w-full">
              Create Lesson
            </Button>
          </Form.Root>
        </div>
      </div>
    </div>
  );
}
