import { Button, Dialog, DropdownMenu, Flex } from "@radix-ui/themes";
import { Form } from "radix-ui";
import { useRef } from "react";

interface LessonOptionsProps {
  nextAudioDelay: number;
  setNextAudioDelay: (value: number) => void;
}

export function LessonOptions({
  nextAudioDelay,
  setNextAudioDelay,
}: LessonOptionsProps) {
  const openFormRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  function openDialog() {
    if (openFormRef.current) openFormRef.current.click();
  }

  return (
    <div>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="soft">
            Options
            <DropdownMenu.TriggerIcon />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item shortcut="⌘ E">Edit</DropdownMenu.Item>
          <DropdownMenu.Item shortcut="⌘ D">Duplicate</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item shortcut="⌘ N">Archive</DropdownMenu.Item>

          <DropdownMenu.Item onClick={openDialog}>
            Advanced options…
          </DropdownMenu.Item>

          <DropdownMenu.Separator />
          <DropdownMenu.Item>Share</DropdownMenu.Item>
          <DropdownMenu.Item>Add to favorites</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item shortcut="⌘ ⌫" color="red">
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <Dialog.Root>
        <Dialog.Trigger>
          <Button ref={openFormRef} hidden></Button>
        </Dialog.Trigger>

        <Dialog.Content maxWidth="450px">
          <Dialog.Title>Advanced Configuration</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Configure the advanced settings for your study session. ✨
          </Dialog.Description>

          <Form.Root className="space-y-4">
            <Form.Field name="delay" className="flex flex-col gap-2">
              <Form.Label className="block text-gray-300">
                Delay (in Seconds)
              </Form.Label>
              <Form.Control asChild>
                <input
                  type="number"
                  value={nextAudioDelay / 1000}
                  onChange={(e) =>
                    setNextAudioDelay(Number(e.target.value) * 1000)
                  }
                  required
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
              <Dialog.Close>
                <Button>Save</Button>
              </Dialog.Close>
            </Flex>
          </Form.Root>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}
