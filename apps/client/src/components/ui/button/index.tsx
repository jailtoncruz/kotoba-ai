import { twMerge } from "tailwind-merge";

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  appearance?: "primary" | "secondary" | "danger";
  type?: "button" | "submit" | "reset";
  className?: string;
}

const appearanceMap = new Map([
  ["primary", "bg-blue-600 hover:bg-blue-700"],
  ["secondary", "bg-gray-600 hover:bg-gray-700"],
  ["danger", "bg-red-600 hover:bg-red-700"],
]);

export function Button({
  onClick,
  children,
  appearance,
  type,
  className,
}: ButtonProps) {
  const styles = twMerge(
    "px-4 py-2 text-gray-100 rounded",
    appearanceMap.get(appearance ?? "primary"),
    className
  );

  return (
    <button onClick={onClick} className={styles} type={type ?? "button"}>
      {children}
    </button>
  );
}
