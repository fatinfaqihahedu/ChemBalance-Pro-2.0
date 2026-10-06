import React, { useState, useMemo } from 'react';
import {
  CATIONS,
  ANIONS,
  IonItem,
  balanceIonicCompound,
  formatFormulaWithSubscripts,
} from '../data/chemistryData';
import {
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Wand2,
  Plus,
  Minus,
  Award,
} from 'lucide-react';

interface InteractiveSimViewProps {
  cation: IonItem;
  anion: IonItem;
  onSelectCation: (c: IonItem) => void;
  onSelectAnion: (a: IonItem) => void;
  isDark: boolean;
}

interface SimChallenge {
  id: string;
  stageLabel: string;
  title: string;
  catId: string;
  anId: string;
  hint: string;
}

const SIM_CHALLENGES: SimChallenge[] = [
  {
    id: 'sim-1',
    stageLabel: 'Stage 1: Basic 1:2 Ratio',
    title: 'Magnesium chloride (Mg²⁺ & Cl⁻)',
    catId: 'mg',
    anId: 'cl',
    hint: '1 Mg²⁺ ion (+2) requires how many Cl⁻ ions (-1) so the net charge equals 0?',
  },
  {
    id: 'sim-2',
    stageLabel: 'Stage 2: Polyatomic Group',
    title: 'Calcium hydroxide (Ca²⁺ & OH⁻)',
    catId: 'ca',
    anId: 'oh',
    hint: 'Notice how 2 OH⁻ groups require brackets Ca(OH)₂ once balanced.',
  },
  {
    id: 'sim-3',
    stageLabel: 'Stage 3: 2:3 Charge Multiple',
    title: 'Aluminium sulfate (Al³⁺ & SO₄²⁻)',
    catId: 'al',
    anId: 'so4',
    hint: 'Find the lowest common multiple of charges +3 and -2 (which is +6 and -6).',
  },
  {
    id: 'sim-4',
    stageLabel: 'Stage 3: Transition Metal',
    title: 'Iron(III) oxide (Fe³⁺ & O²⁻)',
    catId: 'fe3',
    anId: 'o',
    hint: 'Balance the +3 charge from Fe³⁺ against the -2 charge from O²⁻.',
  },
];

export const InteractiveSimView: React.FC<InteractiveSimViewProps> = ({
  cation,
  anion,
  onSelectCation,
  onSelectAnion,
  isDark,
}) => {
  const [cationUnits, setCationUnits] = useState<number>(1);
  const [anionUnits, setAnionUnits] = useState<number>(1);
  const [temperatureC, setTemperatureC] = useState<number>(25);
  const [molarity, setMolarity] = useState<number>(1.0);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);

  const targetBalanced = useMemo(
    () => balanceIonicCompound(cation, anion),
    [cation, anion]
  );

  const totalPos = cationUnits * cation.charge;
  const totalNeg = anionUnits * anion.charge;
  const netCharge = totalPos + totalNeg;

  const isExactEmpiricalMatch =
    cationUnits === targetBalanced.cationCount &&
    anionUnits === targetBalanced.anionCount;

  const isChargeZeroMultiple =
    netCharge === 0 && cationUnits > 0 && anionUnits > 0 && !isExactEmpiricalMatch;

  const activeChallenge = SIM_CHALLENGES.find(
    (ch) => ch.catId === cation.id && ch.anId === anion.id
  );

  const handleLoadChallenge = (ch: SimChallenge) => {
    const c = CATIONS.find((x) => x.id === ch.catId);
    const a = ANIONS.find((x) => x.id === ch.anId);
    if (c && a) {
      onSelectCation(c);
      onSelectAnion(a);
      setCationUnits(1);
      setAnionUnits(1);
    }
  };

  const handleAutoBalance = () => {
    setCationUnits(targetBalanced.cationCount);
    setAnionUnits(targetBalanced.anionCount);
    if (activeChallenge && !completedChallenges.includes(activeChallenge.id)) {
      setCompletedChallenges((prev) => [...prev, activeChallenge.id]);
    }
  };

  if (
    activeChallenge &&
    isExactEmpiricalMatch &&
    !completedChallenges.includes(activeChallenge.id)
  ) {
    setCompletedChallenges((prev) => [...prev, activeChallenge.id]);
  }

  const beamAngle = Math.max(-16, Math.min(16, -netCharge * 3.2));

  const currentPreviewFormula = useMemo(() => {
    const cBrack = cation.isPolyatomic && cationUnits > 1;
    const aBrack = anion.isPolyatomic && anionUnits > 1;
    const cStr = cBrack
      ? `(${cation.formula})${cationUnits}`
      : `${cation.formula}${cationUnits > 1 ? cationUnits : ''}`;
    const aStr = aBrack
      ? `(${anion.formula})${anionUnits}`
      : `${anion.formula}${anionUnits > 1 ? anionUnits : ''}`;
    return formatFormulaWithSubscripts(`${cStr}${aStr}`);
  }, [cation, anion, cationUnits, anionUnits]);

  return (
    <div className="space-y-8">
      {/* Top Guided Stages Header */}
      <div
        className={`p-6 rounded-xl border ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-1">
              Interactive Lab Simulation · Electrostatic Charge Balance · Cambridge IGCSE
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Visual Ionic Charge Equilibrium Sandbox
            </h1>
          </div>

          <div className="flex items-center gap-3 text-xs font-medium">
            <Award className="w-4 h-4 text-emerald-500" />
            <span>
              Challenges Completed:{' '}
              <strong className="tabular-nums">
                {completedChallenges.length} / {SIM_CHALLENGES.length}
              </strong>
            </span>
          </div>
        </div>

        {/* Progressive Learning Stages */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SIM_CHALLENGES.map((ch) => {
            const isCurrent = ch.catId === cation.id && ch.anId === anion.id;
            const isDone = completedChallenges.includes(ch.id);
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => handleLoadChallenge(ch)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  isCurrent
                    ? 'border-sky-500 bg-sky-500/10 ring-1 ring-sky-500'
                    : isDark
                    ? 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-sky-600 dark:text-sky-400">
                    {ch.stageLabel}
                  </span>
                  {isDone && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      ● Completed
                    </span>
                  )}
                </div>
                <div className="text-xs font-semibold truncate">{ch.title}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two-Zone Sandbox Layout (Left 7 cols Stage, Right 5 cols Control & Concept Deck) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Zone: Interactive Visual Canvas (Electrostatic Balance Scale + Particle Chamber) */}
        <div className="lg:col-span-7 space-y-6">
          <div
            className={`p-6 rounded-xl border ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            {/* Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                ELECTROSTATIC SCALE STATUS · TEMP {temperatureC} °C · {molarity.toFixed(1)} mol/dm³
              </div>

              {isExactEmpiricalMatch ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>● NOMINAL: EMPIRICAL FORMULA BALANCED ({currentPreviewFormula})</span>
                </div>
              ) : isChargeZeroMultiple ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>◆ NET CHARGE ZERO BUT RATIO UNSIMPLIFIED ({cationUnits}:{anionUnits})</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>
                    ▲ UNBALANCED: NET CHARGE {netCharge > 0 ? `+${netCharge}` : netCharge}
                  </span>
                </div>
              )}
            </div>

            {/* Interactive SVG Canvas: Electrostatic Balance Scale & Particle Chamber */}
            <div
              className={`my-5 p-4 rounded-xl border ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <svg
                viewBox="0 0 640 310"
                className="w-full h-auto"
                role="img"
                aria-label="Ionic Charge Balance Scale Simulation"
              >
                {/* Coordinate Grid Lines */}
                <line
                  x1="40"
                  y1="265"
                  x2="600"
                  y2="265"
                  stroke={isDark ? '#334155' : '#cbd5e1'}
                  strokeWidth="2"
                />
                <line
                  x1="320"
                  y1="40"
                  x2="320"
                  y2="265"
                  stroke={isDark ? '#1e293b' : '#e2e8f0'}
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {/* Central Fulcrum Pedestal */}
                <polygon
                  points="290,265 350,265 320,175"
                  fill={isDark ? '#334155' : '#94a3b8'}
                />
                <circle
                  cx="320"
                  cy="175"
                  r="10"
                  fill={isExactEmpiricalMatch ? '#059669' : '#0284c7'}
                />

                {/* Tilting Balance Beam Group */}
                <g
                  transform={`rotate(${beamAngle}, 320, 175)`}
                  style={{ transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  {/* Main Beam Bar */}
                  <rect
                    x="95"
                    y="170"
                    width="450"
                    height="10"
                    rx="5"
                    fill={
                      isExactEmpiricalMatch
                        ? '#059669'
                        : isChargeZeroMultiple
                        ? '#d97706'
                        : isDark
                        ? '#64748b'
                        : '#475569'
                    }
                  />

                  {/* Left Pan (Cations +) */}
                  <line
                    x1="140"
                    y1="175"
                    x2="140"
                    y2="135"
                    stroke="#0284c7"
                    strokeWidth="3"
                  />
                  <rect
                    x="65"
                    y="130"
                    width="150"
                    height="8"
                    rx="4"
                    fill="#0284c7"
                  />

                  {/* Render Cation Particles on Left Pan */}
                  {Array.from({ length: cationUnits }).map((_, idx) => {
                    const row = Math.floor(idx / 3);
                    const col = idx % 3;
                    const cx = 98 + col * 42;
                    const cy = 106 - row * 38;
                    return (
                      <g key={`cat-p-${idx}`}>
                        <circle
                          cx={cx}
                          cy={cy}
                          r="17"
                          fill="#0284c7"
                          stroke="#ffffff"
                          strokeWidth="1.5"
                        />
                        <text
                          x={cx}
                          y={cy + 4}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="11"
                          fontWeight="700"
                          fontFamily="'Outfit', 'Plus Jakarta Sans', sans-serif"
                        >
                          {cation.displayHtml}
                        </text>
                      </g>
                    );
                  })}

                  {/* Left Pan Total Charge Label */}
                  <text
                    x="140"
                    y="202"
                    textAnchor="middle"
                    fill="#0284c7"
                    fontSize="13"
                    fontWeight="700"
                    fontFamily="'Outfit', 'Plus Jakarta Sans', sans-serif"
                  >
                    Total Cation Charge: +{totalPos}
                  </text>

                  {/* Right Pan (Anions -) */}
                  <line
                    x1="500"
                    y1="175"
                    x2="500"
                    y2="135"
                    stroke="#059669"
                    strokeWidth="3"
                  />
                  <rect
                    x="425"
                    y="130"
                    width="150"
                    height="8"
                    rx="4"
                    fill="#059669"
                  />

                  {/* Render Anion Particles on Right Pan */}
                  {Array.from({ length: anionUnits }).map((_, idx) => {
                    const row = Math.floor(idx / 3);
                    const col = idx % 3;
                    const cx = 458 + col * 42;
                    const cy = 106 - row * 38;
                    return (
                      <g key={`an-p-${idx}`}>
                        <circle
                          cx={cx}
                          cy={cy}
                          r="17"
                          fill="#059669"
                          stroke="#ffffff"
                          strokeWidth="1.5"
                        />
                        <text
                          x={cx}
                          y={cy + 4}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="11"
                          fontWeight="700"
                          fontFamily="'Outfit', 'Plus Jakarta Sans', sans-serif"
                        >
                          {anion.displayHtml}
                        </text>
                      </g>
                    );
                  })}

                  {/* Right Pan Total Charge Label */}
                  <text
                    x="500"
                    y="202"
                    textAnchor="middle"
                    fill="#059669"
                    fontSize="13"
                    fontWeight="700"
                    fontFamily="'Outfit', 'Plus Jakarta Sans', sans-serif"
                  >
                    Total Anion Charge: {totalNeg}
                  </text>
                </g>

                {/* Bottom Readout Banner inside SVG */}
                <rect
                  x="150"
                  y="274"
                  width="340"
                  height="30"
                  rx="6"
                  fill={isDark ? '#0f172a' : '#ffffff'}
                  stroke={isDark ? '#334155' : '#cbd5e1'}
                />
                <text
                  x="320"
                  y="294"
                  textAnchor="middle"
                  fill={
                    netCharge === 0
                      ? '#059669'
                      : '#dc2626'
                  }
                  fontSize="12"
                  fontWeight="700"
                  fontFamily="'Outfit', 'Plus Jakarta Sans', sans-serif"
                >
                  Net Charge = (+{totalPos}) + ({totalNeg}) = {netCharge > 0 ? `+${netCharge}` : netCharge}
                </text>
              </svg>
            </div>

            {/* Real-Time Guidance Callout */}
            <div
              className={`p-4 rounded-lg border text-sm ${
                isExactEmpiricalMatch
                  ? isDark
                    ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : isDark
                  ? 'bg-slate-950 border-slate-800 text-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              {isExactEmpiricalMatch ? (
                <div>
                  <strong className="font-semibold">
                    Electrostatic Equilibrium Achieved:
                  </strong>{' '}
                  {cationUnits} {cation.displayHtml} ion(s) (+{totalPos}) exactly neutralise{' '}
                  {anionUnits} {anion.displayHtml} ion(s) ({totalNeg}) to form the stable ionic lattice{' '}
                  <span className="chem-mono font-bold underline">
                    {formatFormulaWithSubscripts(targetBalanced.formulaPlain)}
                  </span>{' '}
                  ({targetBalanced.compoundNameEn}).
                </div>
              ) : isChargeZeroMultiple ? (
                <div>
                  <strong className="font-semibold">Zero Net Charge, Ratio Needs Simplifying:</strong>{' '}
                  Although the total charge is 0, the ratio {cationUnits}:{anionUnits} can be divided further into the simplest empirical ratio{' '}
                  <span className="chem-mono font-bold">
                    {targetBalanced.cationCount}:{targetBalanced.anionCount}
                  </span>{' '}
                  ({formatFormulaWithSubscripts(targetBalanced.formulaPlain)}).
                </div>
              ) : netCharge > 0 ? (
                <div>
                  <strong className="font-semibold">Excess Positive Charge (+{netCharge}):</strong>{' '}
                  The cation pan is heavier. Add more{' '}
                  <span className="chem-mono font-bold">{anion.displayHtml}</span> anion units or reduce cation units until the net electrical charge reaches 0.
                </div>
              ) : (
                <div>
                  <strong className="font-semibold">Excess Negative Charge ({netCharge}):</strong>{' '}
                  The anion pan is heavier. Add more{' '}
                  <span className="chem-mono font-bold">{cation.displayHtml}</span> cation units or reduce anion units until the net electrical charge reaches 0.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Zone: Control & Concept Deck */}
        <div className="lg:col-span-5 space-y-6">
          <div
            className={`p-6 rounded-xl border space-y-6 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-base font-semibold">Laboratory Control Deck</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Adjust ion counts & solution parameters in real time
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAutoBalance}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Auto-Balance</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCationUnits(1);
                    setAnionUnits(1);
                  }}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  title="Reset Scale"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Ion Pair Dropdown Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                  Active Cation (Positive Ion)
                </label>
                <select
                  value={cation.id}
                  onChange={(e) => {
                    const found = CATIONS.find((c) => c.id === e.target.value);
                    if (found) onSelectCation(found);
                  }}
                  className={`w-full px-3 py-2 text-sm rounded-lg border font-medium ${
                    isDark
                      ? 'bg-slate-950 border-slate-700 text-slate-100'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  {CATIONS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.displayHtml} — {c.nameEn} ({c.charge}+)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                  Active Anion (Negative Ion)
                </label>
                <select
                  value={anion.id}
                  onChange={(e) => {
                    const found = ANIONS.find((a) => a.id === e.target.value);
                    if (found) onSelectAnion(found);
                  }}
                  className={`w-full px-3 py-2 text-sm rounded-lg border font-medium ${
                    isDark
                      ? 'bg-slate-950 border-slate-700 text-slate-100'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  {ANIONS.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.displayHtml} — {a.nameEn} ({Math.abs(a.charge)}−)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Labeled Sliders & Stepper Controls for Cation and Anion Units */}
            <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
              {/* Cation Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium mb-2">
                  <span>
                    Cation Units ({cation.displayHtml}):{' '}
                    <strong className="chem-mono text-sky-600 dark:text-sky-400">
                      {cationUnits} {cationUnits === 1 ? 'unit' : 'units'}
                    </strong>
                  </span>
                  <span className="chem-mono text-slate-500">
                    Charge Contribution: +{totalPos}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCationUnits((n) => Math.max(1, n - 1))}
                    className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={6}
                    step={1}
                    value={cationUnits}
                    onChange={(e) => setCationUnits(Number(e.target.value))}
                    className="flex-1 accent-sky-600 cursor-pointer"
                    aria-label="Number of Cation Units"
                  />
                  <button
                    type="button"
                    onClick={() => setCationUnits((n) => Math.min(6, n + 1))}
                    className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Anion Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium mb-2">
                  <span>
                    Anion Units ({anion.displayHtml}):{' '}
                    <strong className="chem-mono text-emerald-600 dark:text-emerald-400">
                      {anionUnits} {anionUnits === 1 ? 'unit' : 'units'}
                    </strong>
                  </span>
                  <span className="chem-mono text-slate-500">
                    Charge Contribution: {totalNeg}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setAnionUnits((n) => Math.max(1, n - 1))}
                    className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={6}
                    step={1}
                    value={anionUnits}
                    onChange={(e) => setAnionUnits(Number(e.target.value))}
                    className="flex-1 accent-emerald-600 cursor-pointer"
                    aria-label="Number of Anion Units"
                  />
                  <button
                    type="button"
                    onClick={() => setAnionUnits((n) => Math.min(6, n + 1))}
                    className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Environmental Lab Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500 dark:text-slate-400">Solution Temp:</span>
                    <span className="chem-mono font-semibold tabular-nums">{temperatureC} °C</span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={80}
                    step={5}
                    value={temperatureC}
                    onChange={(e) => setTemperatureC(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                    aria-label="Solution Temperature in Degrees Celsius"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500 dark:text-slate-400">Concentration:</span>
                    <span className="chem-mono font-semibold tabular-nums">
                      {molarity.toFixed(1)} mol/dm³
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={3.0}
                    step={0.5}
                    value={molarity}
                    onChange={(e) => setMolarity(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                    aria-label="Electrolyte Concentration in mol per cubic decimetre"
                  />
                </div>
              </div>
            </div>

            {/* Active Challenge Hint Box */}
            {activeChallenge && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">
                  {activeChallenge.stageLabel} Hint:
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeChallenge.hint}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
