import { Link, useLocation } from "react-router";
import { Button } from "../ui/button";

export default function Header() {
  const location = useLocation();

  return (
    <header className="flex bg-naist text-white p-4">
      <h1 className="text-2xl">NAIST Syllabus App</h1>
      <Button className="ml-auto bg-indigo-500 hover:bg-indigo-700">
        <Link to={location.pathname === "/" ? "/about" : "/"}>
          {location.pathname === "/" ? "About" : "Home"}
        </Link>
      </Button>
    </header>
  );
}
