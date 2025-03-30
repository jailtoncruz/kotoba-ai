import { ContextMenu } from "@radix-ui/themes";
import { LessonLineDto } from "../../../../../types/interfaces/lesson/lesson-line.dto";

interface LessonLineProps {
  line: LessonLineDto;
  onClick: (line: LessonLineDto) => void;
  isSelected: boolean | undefined;
}

export function LessonLine({ line, onClick, isSelected }: LessonLineProps) {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <div
          key={line.id}
          onClick={() => onClick(line)}
          className="cursor-pointer flex-wrap"
          id={line.id}
        >
          <p
            className={`transition-all text-2xl relative max-w-[700px] ${
              isSelected
                ? "scale-125 text-white left-[89px]"
                : "text-gray-400 left-0"
            }`}
          >
            {line.text}
          </p>
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item>Details</ContextMenu.Item>
        <ContextMenu.Item>Add to Deck</ContextMenu.Item>
        <ContextMenu.Item disabled={line.languageCode !== "ja-JP"}>
          Explain
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
