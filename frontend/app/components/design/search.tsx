import { Share2, SquareCheckBig } from "lucide-react";
import { useMemo } from "react";
import { useLocation } from "react-router";
import { MultiSelect } from "~/components/design/multi-select";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { syllabusAppURL } from "~/routes/syllabus";

export default function Search(props: {
  query: string;
  setQuery: (query: string | null, options?: { history: "replace" }) => void;
  targets: string | string[];
  setTargets: (targets: string[]) => void;
  semester: string[] | null;
  setSemester: (semester: string[] | null) => void;
  courseType: string[] | null;
  setCourseType: (courseType: string[] | null) => void;
  teacherTraining: string[] | null;
  setTeacherTraining: (teacherTraining: string[] | null) => void;
  credits: string[] | null;
  setCredits: (credits: string[] | null) => void;
  required: string[] | null;
  setRequired: (required: string[] | null) => void;
  style: string[] | null;
  setStyle: (style: string[] | null) => void;
  language: string[] | null;
  setLanguage: (language: string[] | null) => void;
  scheduling: string[] | null;
  setScheduling: (scheduling: string[] | null) => void;
  registration: string[] | null;
  setRegistration: (registration: string[] | null) => void;
  INITIAL_TARGETS: string[];
}) {
  const {
    targets,
    semester,
    courseType,
    teacherTraining,
    credits,
    required,
    style,
    language,
    scheduling,
    registration,
    query,
    setQuery,
    setTargets,
    setSemester,
    setCourseType,
    setTeacherTraining,
    setCredits,
    setRequired,
    setStyle,
    setLanguage,
    setScheduling,
    setRegistration,
    INITIAL_TARGETS,
  } = props;
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
          case "semester":
            return semester?.length
              ? lang === "ja"
                ? "学期"
                : "Semester"
              : "";
          case "course_type":
            return courseType?.length
              ? lang === "ja"
                ? "科目区分"
                : "Course type"
              : "";
          case "teacher_training":
            return teacherTraining?.length
              ? lang === "ja"
                ? "教職科目"
                : "Teacher training"
              : "";
          case "credits":
            return credits?.length
              ? lang === "ja"
                ? "単位数"
                : "Credits"
              : "";
          case "required":
            return required?.length
              ? lang === "ja"
                ? "必修区分"
                : "Required status"
              : "";
          case "style":
            return style?.length ? (lang === "ja" ? "授業形態" : "Style") : "";
          case "language":
            return language?.length
              ? lang === "ja"
                ? "使用言語"
                : "Language"
              : "";
          case "scheduling":
            return scheduling?.length
              ? lang === "ja"
                ? "開講時期"
                : "Scheduling"
              : "";
          case "registration":
            return registration?.length
              ? lang === "ja"
                ? "履修登録"
                : "Registration"
              : "";
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
  }, [
    targets,
    lang,
    semester,
    courseType,
    teacherTraining,
    credits,
    required,
    style,
    language,
    scheduling,
    registration,
  ]);

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
    setSemester(null);
    setCourseType(null);
    setTeacherTraining(null);
    setCredits(null);
    setRequired(null);
    setStyle(null);
    setLanguage(null);
    setScheduling(null);
    setRegistration(null);
  };

  const isDefaultState = useMemo(() => {
    const targetArray = Array.isArray(targets)
      ? targets
      : (targets as string).split(",");
    const isDefaultTargets =
      JSON.stringify(targetArray.sort()) ===
      JSON.stringify(INITIAL_TARGETS.sort());
    return (
      (!query || query === "") &&
      isDefaultTargets &&
      !semester &&
      !courseType &&
      !teacherTraining &&
      !credits &&
      !required &&
      !style &&
      !language &&
      !scheduling &&
      !registration
    );
  }, [
    query,
    targets,
    semester,
    courseType,
    teacherTraining,
    credits,
    required,
    style,
    language,
    scheduling,
    registration,
    INITIAL_TARGETS,
  ]);

  return (
    <div className="space-y-4 mb-4">
      <div className="flex gap-2">
        <Input
          className="bg-stone-50"
          placeholder={placeholder}
          lang={lang}
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
          {lang === "ja" ? "授業コード/番号" : "Class code/number"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MultiSelect
          options={[
            { value: "spring", label: lang === "ja" ? "春学期" : "Spring" },
            { value: "fall", label: lang === "ja" ? "秋学期" : "Fall" },
          ]}
          value={semester}
          onValueChange={setSemester}
          placeholder={lang === "ja" ? "学期" : "Semester"}
          lang={lang}
        />

        <MultiSelect
          options={[
            {
              value: "general",
              label: lang === "ja" ? "一般科目" : "General Subjects",
            },
            {
              value: "introduction",
              label: lang === "ja" ? "序論科目" : "Introduction Subjects",
            },
            {
              value: "basic",
              label: lang === "ja" ? "基盤科目" : "Basic Subjects",
            },
            {
              value: "specialized",
              label: lang === "ja" ? "専門科目" : "Specialized Subjects",
            },
            {
              value: "pbl",
              label: lang === "ja" ? "PBL科目" : "PBL Subjects",
            },
            {
              value: "research-based",
              label: lang === "ja" ? "研究活動科目" : "Research-based Subjects",
            },
            {
              value: "research-skills",
              label:
                lang === "ja"
                  ? "研究者の素養を養う科目"
                  : "Courses for Research Skills",
            },
            {
              value: "independent-research",
              label:
                lang === "ja"
                  ? "自立的な研究能力を養う科目"
                  : "Courses for Independent Research Abilities",
            },
          ]}
          value={courseType}
          onValueChange={setCourseType}
          placeholder={lang === "ja" ? "科目区分" : "Course type"}
          lang={lang}
        />

        <MultiSelect
          options={[
            { value: "none", label: lang === "ja" ? "指定なし" : "none" },
            {
              value: "information",
              label: lang === "ja" ? "情報" : "Information",
            },
            { value: "science", label: lang === "ja" ? "理科" : "Science" },
          ]}
          value={teacherTraining}
          onValueChange={setTeacherTraining}
          placeholder={lang === "ja" ? "教職科目" : "Teacher training course"}
          lang={lang}
        />

        <MultiSelect
          options={[
            { value: "1", label: lang === "ja" ? "1単位" : "1Credits" },
            { value: "2", label: lang === "ja" ? "2単位" : "2Credits" },
            { value: "3", label: lang === "ja" ? "3単位" : "3Credits" },
            { value: "4", label: lang === "ja" ? "4単位" : "4Credits" },
            { value: "6", label: lang === "ja" ? "6単位" : "6Credits" },
          ]}
          value={credits}
          onValueChange={setCredits}
          placeholder={lang === "ja" ? "単位数" : "Number of Credits"}
          lang={lang}
        />

        <MultiSelect
          options={[
            { value: "elective", label: lang === "ja" ? "選択" : "Elective" },
            { value: "required", label: lang === "ja" ? "必修" : "Required" },
            {
              value: "required-elective",
              label: lang === "ja" ? "選択必修" : "Required-Elective",
            },
            { value: "free", label: lang === "ja" ? "自由" : "Free" },
          ]}
          value={required}
          onValueChange={setRequired}
          placeholder={
            lang === "ja" ? "選択・必修・自由" : "Required・Elective etc."
          }
          lang={lang}
        />

        <MultiSelect
          options={[
            { value: "lecture", label: lang === "ja" ? "講義" : "Lecture" },
            { value: "seminar", label: lang === "ja" ? "演習" : "Seminar" },
            { value: "thesis", label: lang === "ja" ? "論文" : "Thesis" },
          ]}
          value={style}
          onValueChange={setStyle}
          placeholder={lang === "ja" ? "授業形態" : "Style"}
          lang={lang}
        />

        <MultiSelect
          options={[
            { value: "ja", label: lang === "ja" ? "日本語" : "Japanese" },
            { value: "en", label: lang === "ja" ? "英語" : "English" },
            {
              value: "ja/en",
              label: lang === "ja" ? "日本語/英語" : "Japanese/English",
            },
          ]}
          value={language}
          onValueChange={setLanguage}
          placeholder={lang === "ja" ? "主な使用言語" : "Main language"}
          lang={lang}
        />

        <MultiSelect
          options={[
            { value: "1", label: "I" },
            { value: "2", label: "II" },
            { value: "3", label: "III" },
            {
              value: "none",
              label: lang === "ja" ? "日程の設定なし" : "No set of dates",
            },
            {
              value: "intensive",
              label: lang === "ja" ? "集中講義" : "Intensive course",
            },
          ]}
          value={scheduling}
          onValueChange={setScheduling}
          placeholder={lang === "ja" ? "開講時期" : "Scheduling"}
          lang={lang}
        />

        <MultiSelect
          options={[
            { value: "required", label: lang === "ja" ? "必要" : "Required" },
            {
              value: "not_required",
              label: lang === "ja" ? "不要" : "Not required",
            },
          ]}
          value={registration}
          onValueChange={setRegistration}
          placeholder={
            lang === "ja" ? "履修登録の要否" : "Subject Registration"
          }
          lang={lang}
        />
      </div>

      <div className="grid grid-cols-1">
        <Button
          className="bg-emerald-500 hover:bg-emerald-700"
          onClick={async () => {
            if (navigator.share) {
              await navigator.share({
                title: document.title,
                text: "NAIST Syllabus App",
                url: syllabusAppURL + window.location.pathname,
              });
            } else {
              const msg =
                lang === "ja"
                  ? "このブラウザはシェア機能に対応していません"
                  : "This browser does not support sharing";
              alert(msg);
            }
          }}
        >
          <Share2 />
          {lang === "ja" ? "検索結果を共有" : "Share search results"}
        </Button>
      </div>
    </div>
  );
}
