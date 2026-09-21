import { useState, useEffect } from "react";
import {
  Pill,
  Search,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Info,
  Layers,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Building2,
  FileText,
  Activity,
  ChevronRight,
  TrendingDown,
  ShoppingBag,
} from "lucide-react";
import { searchMedicine, getMedicineSuggestions } from "../../services/medicineService";

const SEARCH_STEPS = [
  { id: 1, text: "Analyzing query & identifying active compounds..." },
  { id: 2, text: "Querying DuckDuckGo across verified online pharmacies..." },
  { id: 3, text: "Synthesizing dosage, substitutes & purchase links with LangChain AI..." },
];

const MedicineFinder = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [medicineData, setMedicineData] = useState(null);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const res = await getMedicineSuggestions();
        if (res?.suggestions) {
          setSuggestions(res.suggestions);
        }
      } catch (err) {
        console.error("Error loading suggestions:", err);
      }
    };
    loadSuggestions();
  }, []);

  // Animate loading step progression
  useEffect(() => {
    let interval;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < SEARCH_STEPS.length - 1 ? prev + 1 : prev));
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSearch = async (searchQuery) => {
    const targetQuery = (searchQuery || query).trim();
    if (!targetQuery) return;

    setLoading(true);
    setError("");
    setMedicineData(null);
    if (searchQuery) setQuery(searchQuery);

    try {
      const response = await searchMedicine(targetQuery);
      if (response && response.success && response.data) {
        setMedicineData(response.data);
      } else {
        setError("Could not retrieve information for this medicine. Please check the spelling.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || err.response?.data?.message || "Failed to fetch medicine details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand-800 to-ink-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 bottom-0 -mb-20 h-48 w-48 rounded-full bg-sky-500/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md text-brand-200 mb-3 border border-white/10">
            <Sparkles size={14} className="text-brand-300" />
            AI-Powered Pharmacy & Drug Finder
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            Find Any Medicine & Verified Buy Links
          </h1>
          <p className="mt-2 text-sm md:text-base text-brand-100/90 leading-relaxed">
            Search any medicine name. Our LangChain AI agent searches live pharmacy websites (Tata 1mg, Apollo, Netmeds, PharmEasy) with DuckDuckGo to find verified purchase links, active salt compositions, and cost-effective generic substitutes.
          </p>

          {/* Search Form */}
          <form onSubmit={onSubmit} className="mt-6 flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="text"
                className="w-full rounded-2xl border-0 bg-white/95 pl-11 pr-4 py-3.5 text-sm font-medium text-ink-900 placeholder:text-ink-400 shadow-inner outline-none transition focus:bg-white focus:ring-4 focus:ring-brand-400/40"
                placeholder="Enter medicine name (e.g. Dolo 650, Augmentin, Pantocid, Allegra)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="btn-primary shrink-0 px-6 py-3.5 rounded-2xl font-bold bg-brand-500 hover:bg-brand-400 text-white shadow-lg shadow-brand-950/40 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw size={17} className="animate-spin" /> Searching...
                </>
              ) : (
                <>
                  <Pill size={17} /> Search Medicine
                </>
              )}
            </button>
          </form>

          {/* Quick Suggestions Pills */}
          {suggestions.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-semibold text-brand-200/80">Trending Searches:</span>
              {suggestions.slice(0, 6).map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => handleSearch(item.name)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-sm transition hover:bg-white/20 hover:scale-105 active:scale-95 border border-white/10"
                >
                  <span>{item.name}</span>
                  <span className="text-[10px] text-brand-200">({item.category})</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Loading Progress State with Animated Steps */}
      {loading && (
        <div className="card card-pad border-brand-200 bg-brand-50/50">
          <div className="flex flex-col items-center justify-center text-center py-6 space-y-4">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 shadow-sm">
              <Pill size={32} className="animate-pulse" />
              <div className="absolute inset-0 rounded-2xl border-2 border-brand-400 border-t-transparent animate-spin" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-ink-900">
                Agent Searching Across Live Pharmacies...
              </h3>
              <p className="text-xs text-ink-500">
                Leveraging LangChain Groq LLM and DuckDuckGo live search index
              </p>
            </div>

            {/* Stepper */}
            <div className="w-full max-w-md space-y-2 text-left pt-2">
              {SEARCH_STEPS.map((step, idx) => {
                const isCurrent = idx === loadingStep;
                const isDone = idx < loadingStep;
                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 rounded-xl p-2.5 transition-all text-xs font-medium ${
                      isCurrent
                        ? "bg-white text-brand-700 shadow-sm border border-brand-200 font-semibold scale-[1.02]"
                        : isDone
                        ? "text-emerald-700"
                        : "text-ink-400 opacity-60"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    ) : isCurrent ? (
                      <RefreshCw size={16} className="text-brand-600 animate-spin shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-ink-300 shrink-0" />
                    )}
                    <span>{step.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && !loading && (
        <div className="card card-pad border-coral-200 bg-coral-50/60 flex items-start gap-3">
          <AlertTriangle size={20} className="text-coral-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-coral-900">Search Notice</h4>
            <p className="text-xs text-coral-700 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Results View */}
      {medicineData && !loading && (
        <div className="space-y-6">
          {/* Main Drug Overview Card */}
          <div className="card card-pad border-brand-100 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-ink-100 pb-5">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="badge badge-blue">
                    <Building2 size={12} /> {medicineData.category || "Therapeutic Medication"}
                  </span>
                  {medicineData.prescription_required ? (
                    <span className="badge badge-amber font-bold">
                      <FileText size={12} /> Rx Required
                    </span>
                  ) : (
                    <span className="badge badge-green font-bold">
                      <ShieldCheck size={12} /> Over-the-Counter (OTC)
                    </span>
                  )}
                  {medicineData.manufacturer && (
                    <span className="badge badge-slate">
                      Mfr: {medicineData.manufacturer}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-ink-900 tracking-tight">
                  {medicineData.medicine_name}
                </h2>
                <p className="text-sm font-semibold text-brand-700 mt-1 flex items-center gap-1.5">
                  <Layers size={14} /> Active Salt: {medicineData.generic_name}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="#buy-section"
                  className="btn-primary rounded-xl px-4 py-2 text-xs font-bold shadow-md shadow-brand-600/20"
                >
                  <ShoppingBag size={14} /> View Buy Links ({medicineData.buy_links?.length || 0})
                </a>
              </div>
            </div>

            {/* Description */}
            <p className="mt-4 text-sm leading-relaxed text-ink-700 font-normal">
              {medicineData.description}
            </p>

            {/* Indications & Dosage grid */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Uses */}
              <div className="rounded-2xl bg-ink-50/70 p-4 border border-ink-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink-600 flex items-center gap-1.5 mb-2.5">
                  <Activity size={14} className="text-brand-600" /> Primary Indications & Uses
                </h4>
                <ul className="space-y-1.5">
                  {medicineData.uses?.map((u, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-ink-800 font-medium">
                      <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{u}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Available Forms */}
              <div className="rounded-2xl bg-ink-50/70 p-4 border border-ink-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink-600 flex items-center gap-1.5 mb-2.5">
                  <Pill size={14} className="text-indigo-600" /> Available Strengths & Dosage Forms
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {medicineData.dosage_forms?.map((form, i) => (
                    <span
                      key={i}
                      className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-ink-700 border border-ink-200 shadow-2xs"
                    >
                      {form}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section: Direct Pharmacy Buy Links */}
          <div id="buy-section" className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="section-title flex items-center gap-2">
                  <ShoppingBag size={20} className="text-brand-600" /> Where to Buy Online
                </h3>
                <p className="text-xs text-ink-500 mt-0.5">
                  Real-time pharmacy product links discovered via DuckDuckGo web index
                </p>
              </div>
              <span className="badge badge-green font-semibold">
                {medicineData.buy_links?.length || 0} Stores Found
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {medicineData.buy_links?.map((link, idx) => (
                <div
                  key={idx}
                  className="card p-4 flex flex-col justify-between border-ink-200/80 hover:border-brand-400 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{link.icon || "💊"}</span>
                        <span className="font-bold text-sm text-ink-900">{link.source}</span>
                      </div>
                      <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700 border border-brand-200">
                        {link.badge || "Verified"}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-ink-800 line-clamp-2 leading-snug group-hover:text-brand-600 transition-colors">
                      {link.title}
                    </h4>

                    {link.snippet && (
                      <p className="text-[11px] text-ink-500 line-clamp-2 leading-relaxed">
                        {link.snippet}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-ink-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-emerald-700">
                      {link.price_estimate || "In Stock Online"}
                    </span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-sm bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg inline-flex items-center gap-1 text-[11px] transition shadow-xs"
                    >
                      <span>Buy Online</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Substitutes & Generic Alternatives */}
          {medicineData.substitutes?.length > 0 && (
            <div className="card card-pad border-ink-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="section-title flex items-center gap-2">
                    <TrendingDown size={20} className="text-emerald-600" /> Substitutes & Generic Alternatives
                  </h3>
                  <p className="text-xs text-ink-500 mt-0.5">
                    Chemically equivalent formulations with identical salt strength for cost comparison
                  </p>
                </div>
                <span className="badge badge-green">
                  Generic Equivalents
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {medicineData.substitutes.map((sub, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-ink-100 bg-emerald-50/30 p-3.5 hover:bg-emerald-50/70 transition flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-ink-900">{sub.name}</h4>
                      <p className="text-xs text-ink-600 mt-0.5">{sub.composition}</p>
                      {sub.manufacturer && (
                        <p className="text-[11px] text-ink-400 mt-1">By: {sub.manufacturer}</p>
                      )}
                    </div>
                    <div className="mt-3 pt-2 border-t border-emerald-100/80 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-700">
                        {sub.price_comparison || "Generic alternative"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSearch(sub.name)}
                        className="text-[11px] font-bold text-brand-600 hover:text-brand-800 inline-flex items-center gap-0.5"
                      >
                        Search <ArrowRight size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Warnings and Side Effects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Warnings */}
            <div className="card card-pad border-amber-200 bg-amber-50/30">
              <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2 mb-3">
                <AlertTriangle size={16} className="text-amber-600 shrink-0" /> Important Warnings & Precautions
              </h4>
              <ul className="space-y-2">
                {medicineData.warnings?.map((w, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-amber-950">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Side effects */}
            <div className="card card-pad border-ink-100">
              <h4 className="text-sm font-bold text-ink-900 flex items-center gap-2 mb-3">
                <Info size={16} className="text-sky-600 shrink-0" /> Common Side Effects
              </h4>
              <ul className="space-y-2">
                {medicineData.side_effects?.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-ink-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Clinical Reference Links */}
          {medicineData.info_links?.length > 0 && (
            <div className="card card-pad">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink-500 mb-3">
                Authoritative Clinical Monographs & Guides
              </h4>
              <div className="divide-y divide-ink-100">
                {medicineData.info_links.map((info, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-ink-800">{info.source}</span>
                        <span className="badge badge-slate text-[10px]">{info.badge || "Clinical Guide"}</span>
                      </div>
                      <p className="text-xs text-ink-600 truncate mt-0.5">{info.title}</p>
                    </div>
                    <a
                      href={info.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost btn-sm text-brand-600 hover:text-brand-700 shrink-0 text-xs font-bold flex items-center gap-1"
                    >
                      <span>Read Guide</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medical Disclaimer Banner */}
          <div className="rounded-2xl border border-ink-200 bg-ink-50 p-4 text-xs text-ink-600 leading-relaxed">
            <p className="font-semibold text-ink-800 mb-0.5">⚠️ Medical Disclaimer</p>
            {medicineData.disclaimer}
          </div>
        </div>
      )}

      {/* Empty State when no query is searched */}
      {!medicineData && !loading && (
        <div className="card card-pad text-center py-12 space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <ShoppingBag size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-ink-900">
              Search Any Medicine to Compare Prices & Buy Online
            </h3>
            <p className="text-xs text-ink-500 max-w-md mx-auto">
              Type any brand or generic drug above to get comprehensive active salt details, substitute comparisons, and live links across verified e-pharmacies.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
            {["Dolo 650", "Augmentin 625", "Pantocid 40", "Allegra 120", "Metformin 500", "Combiflam"].map((med) => (
              <button
                key={med}
                onClick={() => handleSearch(med)}
                className="btn-secondary btn-sm text-xs rounded-xl font-medium"
              >
                Search "{med}"
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineFinder;
