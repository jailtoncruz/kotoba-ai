import { Link } from "react-router-dom";

interface MenuProps {
  isMenuOpen: boolean;
}

export function Menu({ isMenuOpen }: MenuProps) {
  return (
    <aside
      className={`bg-gray-800 transform ${isMenuOpen ? "w-64 p-4 translate-x-0" : "w-0 p-0 -translate-x-64"} transition-all duration-300`}
    >
      <nav>
        <ul>
          <li className="mb-4">
            <Link to="/home" className="text-gray-100 hover:text-white">
              Home
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/home/deck" className="text-gray-100 hover:text-white">
              Deck
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/home/practice"
              className="text-gray-100 hover:text-white"
            >
              Practice
            </Link>
          </li>
          {/* <li>
            <Link
              to="/home/settings"
              className="text-gray-100 hover:text-white"
            >
              Settings
            </Link>
          </li> */}
        </ul>
      </nav>
    </aside>
  );
}
