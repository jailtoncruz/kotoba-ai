import React, { useRef, useState } from "react";
import { Form } from "radix-ui";
import { Button, Dialog, Flex, Spinner } from "@radix-ui/themes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateLessonDto } from "../../../../core/interfaces/create-lesson.dto";
import { createLesson } from "../../../../shared/services/api/lesson/create-lesson";

export function CreateLessonDialog() {
  const queryClient = useQueryClient();
  const [lesson, setLesson] = useState<CreateLessonDto>({
    name: "",
    subject: "",
  });

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const mutation = useMutation({
    mutationFn: createLesson,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (closeButtonRef.current) closeButtonRef.current.click();

    mutation.mutate(lesson, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["lessons"] });
      },
    });

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
    <Dialog.Root>
      <Dialog.Trigger>
        <Button disabled={mutation.isPending}>
          {mutation.isPending ? (
            <>
              <Spinner /> Creating...
            </>
          ) : (
            "New Lesson"
          )}
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>New Lesson</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Describe what you want to study right now 😊
        </Dialog.Description>

        <Form.Root onSubmit={handleSubmit} className="space-y-4">
          <Form.Field name="name">
            <Form.Label className="block text-sm font-medium mb-1">
              Lesson Name
            </Form.Label>
            <Form.Control asChild>
              <input
                type="text"
                name="name"
                value={lesson.name}
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

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray" ref={closeButtonRef}>
                Cancel
              </Button>
            </Dialog.Close>
            <Button type="submit">Save</Button>
          </Flex>
        </Form.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
}
