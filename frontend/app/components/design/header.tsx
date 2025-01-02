import { LanguagesIcon } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { Button } from "~/components/ui/button";

export default function Header() {
  const [searchParams, setSearchParams] = useSearchParams();
  const lang = searchParams.get("lang") || "ja";

  function handleLangToggle() {
    const newLang = lang === "en" ? "ja" : "en";
    searchParams.set("lang", newLang);
    setSearchParams(searchParams);
  }

  return (
    <header className="flex bg-naist text-white p-4">
      <Link to={`/?${searchParams}`} className="mr-2">
        <div className="flex items-center">
          <img src="/logo.png" alt="NAIST Apps logo" className="w-8 h-8 mr-2" />
          <h1 className="text-xl md:text-2xl">NAIST Syllabus App</h1>
        </div>
      </Link>

      <div className="flex-grow" />
      <Button
        variant="outline"
        className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-full"
        onClick={handleLangToggle}
      >
        <LanguagesIcon />
        {lang === "en" ? "日本語" : "English"}
      </Button>
    </header>
  );
}
