import { useEffect, useState } from "react";
import { BookOpen, Clock, ChevronDown, ChevronUp, GraduationCap } from "lucide-react";
import { getLibrary } from "../../services/learningService";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";

const CATEGORY_ICON_COLORS = {
  Nutrition: "bg-peach-50 text-peach-700 border border-peach-200/60",
  "Physical Activity": "bg-brand-50 text-brand-700 border border-brand-200/60",
  Sleep: "bg-amber-50 text-amber-700 border border-amber-200/60",
  "Mental Well-being": "bg-coral-50 text-coral-600 border border-coral-200/60",
  "Health Awareness": "bg-peach-100 text-peach-800 border border-peach-200/60",
};

const Education = () => {
  const [library, setLibrary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openLesson, setOpenLesson] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getLibrary();
        setLibrary(data.library);
      } catch {
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <Loader label="Loading the education hub..." />;

  const categories = library ? Object.entries(library) : [];

  return (
    <div>
      <h1 className="page-title">Education Hub</h1>
      <p className="page-subtitle">
        Free-to-browse health articles, independent of your personal learning path.
      </p>

      {categories.length === 0 ? (
        <EmptyState icon={GraduationCap} title="Nothing here yet" description="Check back soon." />
      ) : (
        <div className="mt-6 space-y-8">
          {categories.map(([category, lessons]) => (
            <section key={category}>
              <div className="mb-3 flex items-center gap-2">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    CATEGORY_ICON_COLORS[category] || "bg-ink-100 text-ink-600"
                  }`}
                >
                  <BookOpen size={18} />
                </div>
                <h2 className="section-title">{category}</h2>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {lessons.map((lesson, idx) => {
                  const key = `${category}-${idx}`;
                  const isOpen = openLesson === key;
                  return (
                    <div key={key} className="card-pad border-peach-100/90">
                      <button
                        className="flex w-full items-center justify-between gap-3 text-left"
                        onClick={() => setOpenLesson(isOpen ? null : key)}
                      >
                        <div>
                          <p className="font-bold text-ink-900">{lesson.title}</p>
                          <p className="mt-1 flex items-center gap-1 text-xs text-ink-400">
                            <Clock size={12} /> {lesson.estimatedMinutes} min read
                          </p>
                        </div>
                        {isOpen ? (
                          <ChevronUp size={18} className="shrink-0 text-ink-400" />
                        ) : (
                          <ChevronDown size={18} className="shrink-0 text-ink-400" />
                        )}
                      </button>
                      {isOpen && (
                        <p className="mt-3 border-t border-ink-100 pt-3 text-sm leading-relaxed text-ink-600 animate-fadeIn">
                          {lesson.content}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default Education;
