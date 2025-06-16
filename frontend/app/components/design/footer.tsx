import { BookMarked, Github, House } from "lucide-react";
import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="flex flex-col bg-naist text-white p-4 justify-center items-center">
      <div className="flex flex-col mb-2 justify-center">
        <Link
          to="https://edu-portal.naist.jp/uprx/up/pk/pky001/Pky00101.xhtml?guestlogin=Kmh006"
          className="mr-4 text-black m-1"
          target="_blank"
          rel="noreferrer"
        >
          <div className="flex items-center">
            <BookMarked className="mr-1" />
            Original Syllabus
          </div>
        </Link>
        <Link
          to="https://github.com/yashikota/syllabus"
          className="mr-4 text-black m-1"
          target="_blank"
          rel="noreferrer"
        >
          <div className="flex items-center">
            <Github className="mr-1" />
            GitHub
          </div>
        </Link>
      </div>
      <div className="flex justify-center text-sm text-black">
        <span>© 2025 NAIST Syllabus App</span>
      </div>
    </footer>
  );
}
