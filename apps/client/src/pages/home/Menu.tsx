import { Link } from "react-router-dom";

interface MenuProps {
  isMenuOpen: boolean;
}

function MenuItem({
  to,
  children,
}: {
  to: string;
  children?: React.ReactNode;
}) {
  return (
    <li className="mb-4">
      <Link to={to} className="text-gray-800 hover:text-gray-600">
        {children}
      </Link>
    </li>
  );
}

export function Menu({ isMenuOpen }: MenuProps) {
  return (
    <aside
      className={`transform ${isMenuOpen ? "w-64 p-4 translate-x-0" : "w-0 p-0 -translate-x-64"} transition-all duration-300`}
    >
      <nav>
        <ul>
          <MenuItem to="/home">Home</MenuItem>
          <MenuItem to="/home/deck">Deck</MenuItem>
          <MenuItem to="/home/practice">Practice</MenuItem>
          <MenuItem to="/home/lessons">Custom Lessons</MenuItem>
        </ul>
      </nav>
    </aside>
  );
}
