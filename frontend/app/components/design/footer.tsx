import { Github } from "lucide-react";
import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="flex flex-col bg-naist text-white p-4">
      <div className="flex mb-2 justify-center">
        <Link
          to="https://github.com/yashikota/syllabus"
          className="mr-4"
          target="_blank"
          rel="noreferrer"
        >
          <div className="flex items-center">
            <Github className="mr-1" />
            GitHub
          </div>
        </Link>
      </div>
      <div className="flex justify-center">
        <span>© 2024 NAIST Syllabus App</span>
      </div>
    </footer>
  );
}
