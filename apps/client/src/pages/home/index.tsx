import { Separator } from "@radix-ui/themes";
import { FiPlayCircle } from "react-icons/fi";

export function Home() {
  return (
    <div className="flex flex-1 flex-col px-14 py-4 max-w-[900px] mx-auto w-full">
      <h1 className="font-mochiy text-title uppercase text-2xl">
        Study your deck
      </h1>

      <div>
        <div className="bg-white border-2 border-primary rounded-lg h-48 w-96 my-8 flex flex-col px-4 py-2">
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="font-noto text-7xl text-slate-800">わたし</p>
          </div>
          <div className="flex flex-row justify-between items-center">
            <p className="text-slate-800">I (Me)</p>
            <FiPlayCircle size={32} color="red" />
          </div>
        </div>
      </div>

      <Separator size="4" />

      <h1 className="font-mochiy text-title uppercase text-2xl mt-8">
        LESSONS
      </h1>
    </div>
  );
}
