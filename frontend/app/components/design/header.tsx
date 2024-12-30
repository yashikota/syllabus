import { Link } from "react-router";

export default function Header() {
  return (
    <header className="flex bg-naist text-white p-4">
      <Link to="/" className="mr-2">
        <div className="flex items-center">
          <img src="/logo.png" alt="NAIST Apps logo" className="w-8 h-8 mr-2" />
          <h1 className="text-2xl">NAIST Syllabus App</h1>
        </div>
      </Link>
    </header>
  );
}
