import React, { useState, useMemo } from 'react';
import {
  CATIONS,
  ANIONS,
  IonItem,
  balanceIonicCompound,
  formatFormulaWithSubscripts,
  parseCustomIonQuery,
} from '../data/chemistryData';
import { CheckCircle2, ArrowRight, Search, FlaskConical } from 'lucide-react';

interface IonBalancerViewProps {
  selectedCation: IonItem;
  selectedAnion: IonItem;
  onSelectCation: (cation: IonItem) => void;
  onSelectAnion: (anion: IonItem) => void;
  onOpenInSimulation: (cation: IonItem, anion: IonItem) => void;
  isDark: boolean;
}

export const IonBalancerView: React.FC<IonBalancerViewProps> = ({
  selectedCation,
  selectedAnion,
  onSelectCation,
  onSelectAnion,
  onOpenInSimulation,
  isDark,
}) => {
  const [customQuery, setCustomQuery] = useState('');
  const [queryFeedback, setQueryFeedback] = useState<string | null>(null);
  const [activeStepFilter, setActiveStepFilter] = useState<number | 'all'>('all');

  const result = useMemo(
    () => balanceIonicCompound(selectedCation, selectedAnion),
    [selectedCation, selectedAnion]
  );

  const handleQuickInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseCustomIonQuery(customQuery);
    if (parsed) {
      onSelectCation(parsed.cation);
      onSelectAnion(parsed.anion);
      setQueryFeedback(
        `Matched ions: ${parsed.cation.displayHtml} + ${parsed.anion.displayHtml}`
      );
    } else {
      setQueryFeedback(
        'Input not recognised. Try examples like "Al3+ + SO4 2-", "Ca + OH", or "Iron(III) chloride".'
      );
    }
  };

  const presetPairs: { label: string; catId: string; anId: string; note: string }[] = [
    { label: 'Al³⁺ + SO₄²⁻', catId: 'al', anId: 'so4', note: '2:3 Ratio & Brackets' },
    { label: 'Ca²⁺ + OH⁻', catId: 'ca', anId: 'oh', note: 'Requires Brackets (OH)₂' },
    { label: 'Mg²⁺ + O²⁻', catId: 'mg', anId: 'o', note: 'Simplify Ratio 2:2 → 1:1' },
    { label: 'NH₄⁺ + CO₃²⁻', catId: 'nh4', anId: 'co3', note: 'Polyatomic Cation (NH₄)₂' },
    { label: 'Fe³⁺ + Cl⁻', catId: 'fe3', anId: 'cl', note: 'Transition Metal (III)' },
  ];

  const atomBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.entries(selectedCation.atomicComposition).forEach(([el, count]) => {
      counts[el] = (counts[el] || 0) + count * result.cationCount;
    });
    Object.entries(selectedAnion.atomicComposition).forEach(([el, count]) => {
      counts[el] = (counts[el] || 0) + count * result.anionCount;
    });
    return Object.entries(counts);
  }, [selectedCation, selectedAnion, result]);

  return (
    <div className="space-y-8">
      {/* Top Section: Header & Smart Formula Bar */}
      <div
        className={`p-6 rounded-xl border transition-colors ${
          isDark
            ? 'bg-slate-900 border-slate-800'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-1">
              Chapter 02 · Ionic Bonding & Criss-Cross Method · Cambridge IGCSE
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Automatic Ionic Formula Balancer
            </h1>
          </div>

          <form onSubmit={handleQuickInputSubmit} className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                placeholder="Type ions e.g. Al3+ + SO4 2- or Ca + OH"
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'
                }`}
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Balance Now
            </button>
          </form>
        </div>

        {queryFeedback && (
          <div className="mt-3 text-xs font-medium text-sky-600 dark:text-sky-400">
            {queryFeedback}
          </div>
        )}

        {/* Quick Preset Challenges */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 mr-1">
            Common IGCSE Exam Examples:
          </span>
          {presetPairs.map((preset) => {
            const isCurrent =
              selectedCation.id === preset.catId && selectedAnion.id === preset.anId;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  const c = CATIONS.find((x) => x.id === preset.catId);
                  const a = ANIONS.find((x) => x.id === preset.anId);
                  if (c && a) {
                    onSelectCation(c);
                    onSelectAnion(a);
                    setQueryFeedback(null);
                  }
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                  isCurrent
                    ? 'bg-sky-600 text-white border-sky-600'
                    : isDark
                    ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="chem-mono font-semibold">{preset.label}</span>
                <span className="mx-1.5 opacity-50">·</span>
                <span className="opacity-85">{preset.note}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Zone Educational Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Zone (7 cols): Interactive Visual Stage & Step-by-Step Walkthrough */}
        <div className="lg:col-span-7 space-y-6">
          {/* Primary Visual Anchor: Balanced Formula & Criss-Cross Diagram */}
          <div
            className={`p-6 rounded-xl border ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                AUTOMATIC BALANCED RESULT · ZERO NET CHARGE
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>● BALANCED (+{result.totalPositiveCharge} + ({result.totalNegativeCharge}) = 0)</span>
              </div>
            </div>

            {/* Big Formula Result Banner */}
            <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Balanced Ionic Compound Formula
                </div>
                <div className="text-4xl sm:text-5xl font-bold chem-mono tracking-tight text-sky-600 dark:text-sky-400">
                  {formatFormulaWithSubscripts(result.formulaPlain)}
                </div>
                <div className="mt-2 text-base font-semibold">
                  {result.compoundNameEn}
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-2">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Atomic Composition per Formula Unit:
                </div>
                <div className="flex flex-wrap gap-3 text-xs chem-mono">
                  {atomBreakdown.map(([el, count]) => (
                    <span
                      key={el}
                      className={`px-2.5 py-1 rounded border ${
                        isDark
                          ? 'bg-slate-950 border-slate-800 text-slate-200'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      {el}: <strong>{count}</strong> {count === 1 ? 'atom' : 'atoms'}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => onOpenInSimulation(selectedCation, selectedAnion)}
                  className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-sky-600 dark:text-sky-400 border border-sky-500/30 hover:bg-sky-500/10 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>Test This Ion Pair in Lab Simulation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Interactive SVG Criss-Cross & Charge Balance Diagram */}
            <div className="pt-5">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">
                Criss-Cross Method & Ionic Unit Balance Visualiser:
              </div>

              <div
                className={`p-4 rounded-lg border ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <svg
                  viewBox="0 0 640 210"
                  className="w-full h-auto overflow-visible"
                  role="img"
                  aria-label="Criss-Cross Method Diagram"
                >
                  <defs>
                    <marker
                      id="arrowPos"
                      viewBox="0 0 10 10"
                      refX="6"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#0284c7" />
                    </marker>
                    <marker
                      id="arrowNeg"
                      viewBox="0 0 10 10"
                      refX="6"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#059669" />
                    </marker>
                  </defs>

                  {/* Top Row: Cation and Anion with highlighted charges */}
                  <rect
                    x="60"
                    y="16"
                    width="140"
                    height="62"
                    rx="10"
                    fill={isDark ? '#0f172a' : '#ffffff'}
                    stroke="#0284c7"
                    strokeWidth="2"
                  />
                  <text
                    x="115"
                    y="55"
                    textAnchor="middle"
                    fill={isDark ? '#f8fafc' : '#0f172a'}
                    fontSize="24"
                    fontWeight="700"
                    fontFamily="'Outfit', 'Plus Jakarta Sans', sans-serif"
                  >
                    {formatFormulaWithSubscripts(selectedCation.formula)}
                  </text>
                  <circle cx="168" cy="34" r="16" fill="#0284c7" />
                  <text
                    x="168"
                    y="39"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="14"
                    fontWeight="700"
                    fontFamily="'Outfit', 'Plus Jakarta Sans', sans-serif"
                  >
                    {selectedCation.charge}+
                  </text>

                  {/* Plus sign */}
                  <text
                    x="250"
                    y="55"
                    textAnchor="middle"
                    fill={isDark ? '#94a3b8' : '#64748b'}
                    fontSize="22"
                    fontWeight="600"
                  >
                    +
                  </text>

                  {/* Anion Box */}
                  <rect
                    x="300"
                    y="16"
                    width="140"
                    height="62"
                    rx="10"
                    fill={isDark ? '#0f172a' : '#ffffff'}
                    stroke="#059669"
                    strokeWidth="2"
                  />
                  <text
                    x="355"
                    y="55"
                    textAnchor="middle"
                    fill={isDark ? '#f8fafc' : '#0f172a'}
                    fontSize="24"
                    fontWeight="700"
                    fontFamily="'Outfit', 'Plus Jakarta Sans', sans-serif"
                  >
                    {formatFormulaWithSubscripts(selectedAnion.formula)}
                  </text>
                  <circle cx="410" cy="34" r="16" fill="#059669" />
                  <text
                    x="410"
                    y="39"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="14"
                    fontWeight="700"
                    fontFamily="'Outfit', 'Plus Jakarta Sans', sans-serif"
                  >
                    {Math.abs(selectedAnion.charge)}−
                  </text>

                  {/* Criss-Cross Arrows */}
                  <path
                    d="M 168 54 C 190 105, 340 105, 385 138"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="2.5"
                    strokeDasharray="5 3"
                    markerEnd="url(#arrowPos)"
                  />
                  <path
                    d="M 410 54 C 370 105, 220 105, 165 138"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="2.5"
                    strokeDasharray="5 3"
                    markerEnd="url(#arrowNeg)"
                  />

                  {/* Bottom Row: Resulting Subscripts */}
                  <rect
                    x="70"
                    y="138"
                    width="135"
                    height="54"
                    rx="8"
                    fill={isDark ? '#1e293b' : '#f1f5f9'}
                  />
                  <text
                    x="137"
                    y="162"
                    textAnchor="middle"
                    fill={isDark ? '#e2e8f0' : '#1e293b'}
                    fontSize="13"
                    fontWeight="600"
                  >
                    Subscript {selectedCation.formula}: {result.cationCount}
                  </text>
                  <text
                    x="137"
                    y="180"
                    textAnchor="middle"
                    fill="#059669"
                    fontSize="11"
                    fontFamily="'Outfit', 'Plus Jakarta Sans', sans-serif"
                  >
                    ({result.cationCount} × +{selectedCation.charge} = +{result.totalPositiveCharge})
                  </text>

                  <rect
                    x="305"
                    y="138"
                    width="145"
                    height="54"
                    rx="8"
                    fill={isDark ? '#1e293b' : '#f1f5f9'}
                  />
                  <text
                    x="377"
                    y="162"
                    textAnchor="middle"
                    fill={isDark ? '#e2e8f0' : '#1e293b'}
                    fontSize="13"
                    fontWeight="600"
                  >
                    Subscript {selectedAnion.formula}: {result.anionCount}
                  </text>
                  <text
                    x="377"
                    y="180"
                    textAnchor="middle"
                    fill="#0284c7"
                    fontSize="11"
                    fontFamily="'Outfit', 'Plus Jakarta Sans', sans-serif"
                  >
                    ({result.anionCount} × {selectedAnion.charge} = {result.totalNegativeCharge})
                  </text>

                  {/* Right column summary box */}
                  <rect
                    x="475"
                    y="35"
                    width="150"
                    height="140"
                    rx="10"
                    fill={isDark ? '#0f172a' : '#ffffff'}
                    stroke={isDark ? '#334155' : '#cbd5e1'}
                    strokeWidth="1.5"
                  />
                  <text
                    x="550"
                    y="62"
                    textAnchor="middle"
                    fill={isDark ? '#94a3b8' : '#64748b'}
                    fontSize="11"
                    fontWeight="600"
                  >
                    SIMPLEST RATIO
                  </text>
                  <text
                    x="550"
                    y="92"
                    textAnchor="middle"
                    fill={isDark ? '#f8fafc' : '#0f172a'}
                    fontSize="22"
                    fontWeight="700"
                    fontFamily="'Outfit', 'Plus Jakarta Sans', sans-serif"
                  >
                    {result.cationCount} : {result.anionCount}
                  </text>
                  <text
                    x="550"
                    y="118"
                    textAnchor="middle"
                    fill={result.wasSimplified ? '#d97706' : '#059669'}
                    fontSize="11"
                    fontWeight="600"
                  >
                    {result.wasSimplified
                      ? `Simplified (${result.rawRatioCation}:${result.rawRatioAnion})`
                      : 'Direct Lowest Ratio'}
                  </text>
                  <text
                    x="550"
                    y="152"
                    textAnchor="middle"
                    fill="#0284c7"
                    fontSize="18"
                    fontWeight="700"
                    fontFamily="'Outfit', 'Plus Jakarta Sans', sans-serif"
                  >
                    {formatFormulaWithSubscripts(result.formulaPlain)}
                  </text>
                </svg>
              </div>
            </div>
          </div>

          {/* Step-by-Step Explanation Cards for Cambridge IGCSE */}
          <div
            className={`p-6 rounded-xl border ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-extrabold">
                  Step-by-Step Explanation (Cambridge IGCSE)
                </h2>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Select a specific step to focus or view the full derivation sequence.
                </p>
              </div>

              {/* Interactive Filter Controls */}
              <div
                className={`flex items-center gap-1 p-1 rounded-lg ${
                  isDark ? 'bg-slate-950' : 'bg-slate-100'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveStepFilter('all')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    activeStepFilter === 'all'
                      ? 'bg-sky-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All Steps
                </button>
                {[1, 2, 3, 4].map((stepNum) => (
                  <button
                    key={stepNum}
                    type="button"
                    onClick={() => setActiveStepFilter(stepNum)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap tabular-nums cursor-pointer ${
                      activeStepFilter === stepNum
                        ? 'bg-sky-600 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    S{stepNum}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800 mt-2">
              {result.steps
                .filter((s) => activeStepFilter === 'all' || s.stepNumber === activeStepFilter)
                .map((step) => (
                  <div key={step.stepNumber} className="py-4 first:pt-2 last:pb-0">
                    <div className="flex items-baseline justify-between gap-4 mb-1.5">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        0{step.stepNumber}. {step.title}
                      </h3>
                      <span className="text-xs chem-mono font-semibold text-sky-600 dark:text-sky-400 shrink-0">
                        {step.formulaHighlight}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {step.explanation}
                    </p>
                    <div className="mt-2 text-xs text-amber-700 dark:text-amber-400 font-medium">
                      IGCSE Exam Tip: {step.igcseTip}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Zone (5 cols): Interactive Cation & Anion Deck */}
        <div className="lg:col-span-5 space-y-6">
          {/* Cation Selector */}
          <div
            className={`p-6 rounded-xl border ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-base font-semibold">
                  1. Select Cation (Positive Ion)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Metals & positively charged ions (electron loss)
                </p>
              </div>
              <span className="text-sm font-bold chem-mono text-sky-600 dark:text-sky-400">
                Selected: {selectedCation.displayHtml}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {CATIONS.map((cat) => {
                const isSelected = selectedCation.id === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => onSelectCation(cat)}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-sky-500 bg-sky-500/10 ring-1 ring-sky-500'
                        : isDark
                        ? 'border-slate-800 bg-slate-950 hover:border-slate-700'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold chem-mono text-sky-600 dark:text-sky-400">
                        {cat.displayHtml}
                      </span>
                      <span className="text-xs chem-mono text-slate-500 dark:text-slate-400">
                        {cat.charge}+
                      </span>
                    </div>
                    <div className="text-xs font-medium truncate mt-0.5">
                      {cat.nameEn}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Anion Selector */}
          <div
            className={`p-6 rounded-xl border ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-base font-semibold">
                  2. Select Anion (Negative Ion)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Non-metals & negatively charged polyatomic ions
                </p>
              </div>
              <span className="text-sm font-bold chem-mono text-emerald-600 dark:text-emerald-400">
                Selected: {selectedAnion.displayHtml}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {ANIONS.map((an) => {
                const isSelected = selectedAnion.id === an.id;
                return (
                  <button
                    key={an.id}
                    type="button"
                    onClick={() => onSelectAnion(an)}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500'
                        : isDark
                        ? 'border-slate-800 bg-slate-950 hover:border-slate-700'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold chem-mono text-emerald-600 dark:text-emerald-400">
                        {an.displayHtml}
                      </span>
                      <span className="text-xs chem-mono text-slate-500 dark:text-slate-400">
                        {Math.abs(an.charge)}−
                      </span>
                    </div>
                    <div className="text-xs font-medium capitalize truncate mt-0.5">
                      {an.nameEn}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
