import { Home, Info } from "lucide-react";
import { Link, useLocation } from "react-router";
import { Button } from "../ui/button";

export default function Header() {
  const location = useLocation();

  return (
    <header className="flex bg-naist text-white p-4">
      <Link to="/" className="mr-4">
        <div className="flex items-center">
          <img src="/logo.png" alt="NAIST Apps logo" className="w-8 h-8 mr-4" />
          <h1 className="text-2xl hidden sm:block">NAIST Syllabus App</h1>
        </div>
      </Link>
      <Link to={location.pathname === "/" ? "/about" : "/"} className="ml-auto">
        <Button className="bg-indigo-500 hover:bg-indigo-700">
          {location.pathname === "/" ? (
            <>
              <Info /> About
            </>
          ) : (
            <>
              <Home /> Home
            </>
          )}
        </Button>
      </Link>
    </header>
  );
}
