import { twMerge } from "tailwind-merge";
import logoOffWhite from "../assets/logo-off-white.svg";
import logoRed from "../assets/logo-red.svg";

type LogoApparence = "off-white" | "red";
type LogoProps = {
  apparence: LogoApparence;
  className?: string;
  height?: number;
  width?: number;
};
const defaultProps: LogoProps = {
  apparence: "off-white",
};

export function Logo({
  apparence,
  height,
  width,
  className,
}: LogoProps = defaultProps) {
  return (
    <div className={twMerge("flex items-center justify-center", className)}>
      <img
        src={apparence === "off-white" ? logoOffWhite : logoRed}
        alt="Kotoba AI Logo"
        height={height}
        width={width}
      />
    </div>
  );
}
