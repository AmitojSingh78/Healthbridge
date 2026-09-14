import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Trophy,
  Star,
  ArrowLeft,
  CheckCircle2,
  Clock,
  PartyPopper,
} from "lucide-react";
import { getLearningPath, submitQuiz } from "../../services/learningService";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";

const priorityBadge = {
  High: "badge-red",
  Medium: "badge-amber",
  Low: "badge-green",
};

const LearningPath = () => {
  const [learningPath, setLearningPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const loadPath = async () => {
    try {
      const data = await getLearningPath();
      setLearningPath(data.learningPath);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPath();
  }, []);

  const startLesson = (module, lesson) => {
    setSelectedModule(module);
    setSelectedLesson(lesson);
    setAnswers(new Array(lesson.questions.length).fill(null));
    setResult(null);
  };

  const selectAnswer = (questionIndex, answer) => {
    const updated = [...answers];
    updated[questionIndex] = answer;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    if (answers.some((answer) => answer === null)) {
      alert("Please answer all questions.");
      return;
    }

    try {
      const data = await submitQuiz(learningPath._id, selectedModule._id, selectedLesson._id, answers);
      setResult(data);
      setLearningPath(data.learningPath);
    } catch (error) {
      alert(error.response?.data?.message || "Quiz submission failed");
    }
  };

  const closeLesson = () => {
    setSelectedModule(null);
    setSelectedLesson(null);
    setResult(null);
  };

  if (loading) return <Loader label="Loading learning path..." />;

  if (!learningPath) {
    return (
      <div>
        <h1 className="page-title">My Learning Path</h1>
        <div className="mt-6">
          <EmptyState
            icon={BookOpen}
            title="No learning path yet"
            description="Complete your wellness assessment to generate a personalized learning path."
            actionLabel="Take wellness assessment"
            actionTo="/patient/wellness"
          />
        </div>
      </div>
    );
  }
  if (selectedModule && selectedLesson) {
    return (
      <div className="max-w-2xl">
        <button onClick={closeLesson} className="btn-ghost -ml-2.5 mb-3">
          <ArrowLeft size={16} /> Back to learning path
        </button>

        <div className="card-pad">
          <h1 className="text-xl font-extrabold text-ink-900">{selectedLesson.title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-600">{selectedLesson.content}</p>
          <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-ink-400">
            <Clock size={13} /> {selectedLesson.estimatedMinutes} minutes
          </p>
        </div>

        <div className="card-pad mt-4">
          <h2 className="section-title mb-4">Quick check</h2>

          <div className="space-y-6">
            {selectedLesson.questions.map((question, questionIndex) => (
              <div key={question._id}>
                <h3 className="font-semibold text-ink-800">
                  {questionIndex + 1}. {question.question}
                </h3>
                <div className="mt-2.5 space-y-2">
                  {question.options.map((option, optionIndex) => {
                    const checked = answers[questionIndex] === optionIndex;
                    return (
                      <label
                        key={optionIndex}
                        className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm transition ${
                          checked
                            ? "border-brand-500 bg-brand-50 text-brand-800"
                            : "border-ink-200 text-ink-600 hover:bg-ink-50"
                        }`}
                      >
                        <input
                          type="radio"
                          className="accent-brand-600"
                          name={`question-${questionIndex}`}
                          checked={checked}
                          onChange={() => selectAnswer(questionIndex, optionIndex)}
                        />
                        {option}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {result ? (
            <div className="mt-6 rounded-2xl bg-brand-50 p-5 text-center">
              <PartyPopper className="mx-auto text-brand-600" size={28} />
              <h2 className="mt-2 text-lg font-extrabold text-brand-800">Quiz complete!</h2>
              <p className="mt-1 text-2xl font-extrabold text-ink-900">{result.score}%</p>
              <p className="text-sm text-ink-500">
                {result.correct} / {result.total} correct • {result.points} total points
              </p>
              <button onClick={closeLesson} className="btn-primary mt-4">
                Continue learning
              </button>
            </div>
          ) : (
            <button onClick={handleSubmit} className="btn-primary mt-6">
              Submit quiz
            </button>
          )}
        </div>
      </div>
    );
  }
  return (
    <div>
      <h1 className="page-title flex items-center gap-2">
        <BookOpen size={26} className="text-brand-600" /> My Health Learning Path
      </h1>
      <p className="page-subtitle">Your learning journey, personalized to your wellness assessment.</p>

      <div className="card-pad mt-6">
        <div className="flex items-center justify-between">
          <h2 className="section-title">Overall progress</h2>
          <span className="text-xl font-extrabold text-ink-900">{learningPath.overallProgress}%</span>
        </div>
        <div className="progress-track mt-3">
          <div className="progress-fill" style={{ width: `${learningPath.overallProgress}%` }} />
        </div>
        <div className="mt-4 flex gap-6">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-ink-600">
            <Star size={15} className="text-amber-500" /> {learningPath.points} points
          </p>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-ink-600">
            <Trophy size={15} className="text-brand-600" /> {learningPath.completedLessons} lessons completed
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {learningPath.modules.map((module) => (
          <div key={module._id} className="card-pad">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{module.category}</p>
                <h2 className="mt-0.5 font-bold text-ink-900">{module.title}</h2>
                <p className="mt-1 text-sm text-ink-500">{module.description}</p>
              </div>
              <span className={priorityBadge[module.priority] || "badge-slate"}>{module.priority} priority</span>
            </div>

            <div className="progress-track mt-3">
              <div className="progress-fill" style={{ width: `${module.progress}%` }} />
            </div>
            <p className="mt-1 text-xs text-ink-400">{module.progress}% complete</p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {module.lessons.map((lesson) => (
                <div key={lesson._id} className="rounded-xl bg-ink-50 p-4">
                  <h4 className="text-sm font-bold text-ink-800">{lesson.title}</h4>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-400">
                    <Clock size={12} /> {lesson.estimatedMinutes} min
                  </p>
                  <p
                    className={`mt-1.5 flex items-center gap-1 text-xs font-semibold ${
                      lesson.completed ? "text-brand-600" : "text-ink-400"
                    }`}
                  >
                    {lesson.completed ? <CheckCircle2 size={13} /> : <BookOpen size={13} />}
                    {lesson.completed ? "Completed" : "Not completed"}
                  </p>
                  <button onClick={() => startLesson(module, lesson)} className="btn-secondary btn-sm mt-3 w-full">
                    {lesson.completed ? "Review lesson" : "Start lesson"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Link to="/patient/education" className="btn-secondary mt-6 inline-flex">
        Browse the full education library
      </Link>
    </div>
  );
};

export default LearningPath;
