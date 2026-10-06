import React, { useState } from 'react';
import { REACTIONS_DATA, ReactionItem } from '../data/chemistryData';
import {
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Eye,
} from 'lucide-react';

interface ReactionExplorerViewProps {
  isDark: boolean;
}

export const ReactionExplorerView: React.FC<ReactionExplorerViewProps> = ({ isDark }) => {
  const [selectedReactionId, setSelectedReactionId] = useState<string>(REACTIONS_DATA[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(3);
  const [showSpectatorStrike, setShowSpectatorStrike] = useState<boolean>(true);
  const [interactiveMode, setInteractiveMode] = useState<'auto' | 'manual'>('auto');
  const [userCoeffs, setUserCoeffs] = useState<number[]>([1, 1, 1, 1]);

  const reaction: ReactionItem =
    REACTIONS_DATA.find((r) => r.id === selectedReactionId) || REACTIONS_DATA[0];

  const handleSelectReaction = (rxn: ReactionItem) => {
    setSelectedReactionId(rxn.id);
    setCurrentStepIndex(3);
    setUserCoeffs(rxn.balancedCoeffs.map(() => 1));
  };

  const activeCoeffs =
    interactiveMode === 'auto' ? reaction.balancedCoeffs : userCoeffs;

  const isManuallyBalanced = reaction.balancedCoeffs.every(
    (c, idx) => (activeCoeffs[idx] || 1) === c
  );

  const updateUserCoeff = (idx: number, delta: number) => {
    setUserCoeffs((prev) => {
      const next = [...prev];
      const current = next[idx] || 1;
      next[idx] = Math.max(1, Math.min(6, current + delta));
      return next;
    });
  };

  return (
    <div className="space-y-8">
      {/* Header & Reaction Selector Deck */}
      <div
        className={`p-6 rounded-xl border ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-1">
              Chapters 03 & 04 · Stoichiometry, Spectator Ions & Net Ionic Equations · Cambridge IGCSE
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Step-by-Step Chemical & Net Ionic Reaction Walkthroughs
            </h1>
          </div>

          {/* Interactive Mode Switcher */}
          <div
            className={`flex items-center gap-1 p-1 rounded-lg self-start ${
              isDark ? 'bg-slate-950' : 'bg-slate-100'
            }`}
          >
            <button
              type="button"
              onClick={() => setInteractiveMode('auto')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                interactiveMode === 'auto'
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Auto-Balanced View
            </button>
            <button
              type="button"
              onClick={() => {
                setInteractiveMode('manual');
                setUserCoeffs(reaction.balancedCoeffs.map(() => 1));
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                interactiveMode === 'manual'
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Practice Balancing Coefficients
            </button>
          </div>
        </div>

        {/* Reaction Tabs */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {REACTIONS_DATA.map((rxn, idx) => {
            const isSelected = rxn.id === reaction.id;
            return (
              <button
                key={rxn.id}
                type="button"
                onClick={() => handleSelectReaction(rxn)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-sky-500 bg-sky-500/10 ring-1 ring-sky-500'
                    : isDark
                    ? 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Reaction 0{idx + 1} · {rxn.difficulty}
                </div>
                <div className="text-xs font-semibold line-clamp-2 leading-snug">
                  {rxn.titleMs}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two-Column Reaction Stage & Step Walkthrough */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Equation Visualizer & Net Ionic Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          <div
            className={`p-6 rounded-xl border ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {reaction.typeMs} · {reaction.chapterId.replace('bab', 'CHAPTER 0')}
              </div>
              {isManuallyBalanced ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>● EQUATION FULLY BALANCED</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>▲ UNBALANCED — ADJUST COEFFICIENTS</span>
                </div>
              )}
            </div>

            {/* Interactive Stoichiometric Formula Stage */}
            <div className="py-6 border-b border-slate-200 dark:border-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                1. Full Balanced Chemical Equation (with State Symbols):
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {reaction.reactants.map((r, rIdx) => {
                  const coeffVal = activeCoeffs[rIdx] || 1;
                  return (
                    <React.Fragment key={r.formula}>
                      <div
                        className={`p-3 rounded-lg border flex items-center gap-2 ${
                          isDark
                            ? 'bg-slate-950 border-slate-800'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        {interactiveMode === 'manual' ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => updateUserCoeff(rIdx, -1)}
                              className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-800 text-xs font-bold cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-bold chem-mono text-sky-600 dark:text-sky-400">
                              {coeffVal}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateUserCoeff(rIdx, 1)}
                              className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-800 text-xs font-bold cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          coeffVal > 1 && (
                            <span className="text-xl font-bold chem-mono text-sky-600 dark:text-sky-400">
                              {coeffVal}
                            </span>
                          )
                        )}
                        <div>
                          <div className="text-lg font-bold chem-mono">
                            {r.formula}
                            <span className="text-xs font-normal text-slate-500 ml-0.5">
                              {r.state}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {r.nameMs}
                          </div>
                        </div>
                      </div>
                      {rIdx < reaction.reactants.length - 1 && (
                        <span className="text-lg font-bold text-slate-400">+</span>
                      )}
                    </React.Fragment>
                  );
                })}

                <span className="text-xl font-bold text-sky-600 dark:text-sky-400 px-1">
                  →
                </span>

                {reaction.products.map((p, pIdx) => {
                  const globalIdx = reaction.reactants.length + pIdx;
                  const coeffVal = activeCoeffs[globalIdx] || 1;
                  return (
                    <React.Fragment key={p.formula}>
                      <div
                        className={`p-3 rounded-lg border flex items-center gap-2 ${
                          isDark
                            ? 'bg-slate-950 border-slate-800'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        {interactiveMode === 'manual' ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => updateUserCoeff(globalIdx, -1)}
                              className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-800 text-xs font-bold cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-bold chem-mono text-emerald-600 dark:text-emerald-400">
                              {coeffVal}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateUserCoeff(globalIdx, 1)}
                              className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-800 text-xs font-bold cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          coeffVal > 1 && (
                            <span className="text-xl font-bold chem-mono text-emerald-600 dark:text-emerald-400">
                              {coeffVal}
                            </span>
                          )
                        )}
                        <div>
                          <div className="text-lg font-bold chem-mono">
                            {p.formula}
                            <span className="text-xs font-normal text-slate-500 ml-0.5">
                              {p.state}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {p.nameMs}
                          </div>
                        </div>
                      </div>
                      {pIdx < reaction.products.length - 1 && (
                        <span className="text-lg font-bold text-slate-400">+</span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Complete Ionic & Spectator Ion Breakdown */}
            <div className="py-5 border-b border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  2. Aqueous Electrolyte Dissociation & Spectator Ions:
                </span>
                <button
                  type="button"
                  onClick={() => setShowSpectatorStrike(!showSpectatorStrike)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>
                    {showSpectatorStrike
                      ? 'Hide Spectator Strike-Through'
                      : 'Show Spectator Strike-Through'}
                  </span>
                </button>
              </div>

              <div
                className={`p-4 rounded-lg border text-sm chem-mono leading-relaxed ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <span className="text-xs font-sans text-slate-500 block mb-1">
                    Complete Ionic Equation:
                  </span>
                  <span>{reaction.ionicSplitReactants}</span>
                  <span className="mx-2 text-sky-500 font-bold">→</span>
                  <span>{reaction.ionicSplitProducts}</span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs font-sans">
                  <span className="text-slate-500 dark:text-slate-400">
                    Spectator Ions Detected (Unchanged Aqueous Ions on Both Sides):
                  </span>
                  {reaction.spectatorIons.map((ion) => (
                    <span
                      key={ion}
                      className={`chem-mono font-semibold ${
                        showSpectatorStrike
                          ? 'line-through text-rose-500 dark:text-rose-400'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {ion}
                    </span>
                  ))}
                </div>
              </div>

              {/* Net Ionic Equation Highlight */}
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  3. Net Ionic Equation:
                </div>
                <div
                  className={`p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                    isDark
                      ? 'bg-emerald-950/30 border-emerald-800/60'
                      : 'bg-emerald-50/70 border-emerald-200'
                  }`}
                >
                  <div className="text-xl font-bold chem-mono text-emerald-700 dark:text-emerald-300">
                    {reaction.netIonicEquation}
                  </div>
                  <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    ● Active reacting species only
                  </span>
                </div>
              </div>
            </div>

            {/* Atom Conservation Audit Table */}
            <div className="pt-5">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">
                Atom Conservation Audit Table (Unbalanced vs Balanced):
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                      <th className="py-2 font-medium">Element / Ion Group</th>
                      <th className="py-2 font-medium text-right tabular-nums">
                        Initial (Left : Right)
                      </th>
                      <th className="py-2 font-medium text-right tabular-nums">
                        Balanced (Left : Right)
                      </th>
                      <th className="py-2 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {reaction.atomAudit.map((row) => (
                      <tr key={row.element}>
                        <td className="py-2.5 font-medium">
                          <span className="chem-mono font-bold mr-1.5">{row.element}</span>
                          <span className="text-slate-500 dark:text-slate-400">
                            ({row.nameMs})
                          </span>
                        </td>
                        <td className="py-2.5 text-right chem-mono tabular-nums text-slate-500">
                          {row.leftUnbalanced} : {row.rightUnbalanced}
                        </td>
                        <td className="py-2.5 text-right chem-mono font-bold tabular-nums text-sky-600 dark:text-sky-400">
                          {row.balancedCount} : {row.balancedCount}
                        </td>
                        <td className="py-2.5 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                          ● BALANCED
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Step-by-Step Interactive Teacher Guide */}
        <div className="lg:col-span-5 space-y-6">
          <div
            className={`p-6 rounded-xl border ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-base font-semibold">
                  Step-by-Step Reaction Guide
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Showing Steps 1 to {currentStepIndex + 1} of {reaction.steps.length}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentStepIndex === 0}
                  onClick={() => setCurrentStepIndex((i) => Math.max(0, i - 1))}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer"
                  title="Previous Step"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={currentStepIndex === reaction.steps.length - 1}
                  onClick={() =>
                    setCurrentStepIndex((i) => Math.min(reaction.steps.length - 1, i + 1))
                  }
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer"
                  title="Next Step"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStepIndex(reaction.steps.length - 1)}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Show All
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800 mt-2">
              {reaction.steps.slice(0, currentStepIndex + 1).map((st) => (
                <div key={st.step} className="py-4 first:pt-2 last:pb-0">
                  <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">
                    Step 0{st.step}
                  </div>
                  <h3 className="text-sm font-semibold mb-1.5">{st.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                    {st.detail}
                  </p>
                  <div
                    className={`p-2.5 rounded border text-xs chem-mono font-medium ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-slate-200'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    {st.equationState}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
                IGCSE Practical Lab Context:
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {reaction.realWorldContext}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
