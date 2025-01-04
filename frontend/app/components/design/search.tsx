import { SquareCheckBig } from "lucide-react";
import { useQueryState } from "nuqs";
import { useMemo } from "react";
import { useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

const INITIAL_TARGETS = ["class_name", "lecturer", "class_code_number"];

export default function Search() {
  const [query, setQuery] = useQueryState("q", {
    defaultValue: "",
    shallow: false,
  });
  const [targets, setTargets] = useQueryState<string[]>("targets", {
    defaultValue: INITIAL_TARGETS,
    parse: (value) => value.split(","),
    serialize: (value) => value.join(","),
    shallow: false,
  });

  const lang = new URLSearchParams(useLocation().search).get("lang") || "ja";

  const placeholder = useMemo(() => {
    const targetArray = Array.isArray(targets)
      ? targets
      : (targets as string).split(",");

    const searchTerms = targetArray
      .map((target) => {
        switch (target) {
          case "class_name":
            return lang === "ja" ? "授業名" : "Class name";
          case "lecturer":
            return lang === "ja" ? "担当教員" : "Lecturer";
          case "class_code_number":
            return lang === "ja" ? "授業コード/番号" : "Class code/number";
          default:
            return "";
        }
      })
      .filter((term) => term !== "");

    if (searchTerms.length === 0) {
      return lang === "ja" ? "検索" : "Search";
    }

    const searchBy = lang === "ja" ? "で検索" : "Search by ";

    return lang === "ja"
      ? `${searchTerms.join(", ")}${searchBy}`
      : `${searchBy}${searchTerms.join(", ")}`;
  }, [targets, lang]);

  const toggleTarget = (target: string) => {
    const targetArray = Array.isArray(targets)
      ? targets
      : (targets as string).split(",");
    if (targetArray.includes(target)) {
      if (targetArray.length > 1) {
        setTargets(targetArray.filter((t) => t !== target));
      }
    } else {
      setTargets([...targetArray, target]);
    }
  };

  const clearSearch = () => {
    setQuery(null);
    setTargets(INITIAL_TARGETS);
  };

  const isDefaultState = useMemo(() => {
    const targetArray = Array.isArray(targets)
      ? targets
      : (targets as string).split(",");
    const isDefaultTargets =
      JSON.stringify(targetArray.sort()) ===
      JSON.stringify(INITIAL_TARGETS.sort());
    return (!query || query === "") && isDefaultTargets;
  }, [query, targets]);

  return (
    <div className="space-y-4 mb-4">
      <div className="flex gap-2">
        <Input
          className="bg-stone-50"
          placeholder={placeholder}
          value={query || ""}
          onChange={(e) =>
            setQuery(e.target.value, {
              history: "replace",
            })
          }
        />
        <Button
          className="bg-stone-50"
          variant="outline"
          onClick={clearSearch}
          disabled={isDefaultState}
        >
          {lang === "ja" ? "クリア" : "Clear"}
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          className={`flex items-center gap-2 hover:bg-stone-100 ${
            targets.includes("class_name")
              ? "bg-green-200 hover:bg-green-300"
              : ""
          }`}
          onClick={() => toggleTarget("class_name")}
        >
          {targets.includes("class_name") && (
            <SquareCheckBig className="w-4 h-4 text-green-600" />
          )}
          {lang === "ja" ? "授業名" : "Class name"}
        </Button>
        <Button
          variant="outline"
          className={`flex items-center gap-2 hover:bg-stone-100 ${
            targets.includes("lecturer")
              ? "bg-green-200 hover:bg-green-300"
              : ""
          }`}
          onClick={() => toggleTarget("lecturer")}
        >
          {targets.includes("lecturer") && (
            <SquareCheckBig className="w-4 h-4 text-green-600" />
          )}
          {lang === "ja" ? "担当教員" : "Lecturer"}
        </Button>
        <Button
          variant="outline"
          className={`flex items-center gap-2 hover:bg-stone-100 ${
            targets.includes("class_code_number")
              ? "bg-green-200 hover:bg-green-300"
              : ""
          }`}
          onClick={() => toggleTarget("class_code_number")}
        >
          {targets.includes("class_code_number") && (
            <SquareCheckBig className="w-4 h-4 text-green-600" />
          )}
          {lang === "ja" ? "授業コード/番号" : "Class code/ number"}
        </Button>
      </div>
    </div>
  );
}
