import { IGCSE_QUIZ_QUESTIONS } from './quizQuestionsData';

export interface IonItem {
  id: string;
  formula: string;
  displayHtml: string;
  charge: number;
  isPolyatomic: boolean;
  nameMs: string;
  nameEn: string;
  category: string;
  igcseNote: string;
  atomicComposition: Record<string, number>;
}

export interface BalancedCompoundResult {
  cation: IonItem;
  anion: IonItem;
  cationCount: number;
  anionCount: number;
  rawRatioCation: number;
  rawRatioAnion: number;
  wasSimplified: boolean;
  needsCationBrackets: boolean;
  needsAnionBrackets: boolean;
  formulaPlain: string;
  compoundNameMs: string;
  compoundNameEn: string;
  totalPositiveCharge: number;
  totalNegativeCharge: number;
  lcmCharge: number;
  steps: {
    stepNumber: number;
    title: string;
    formulaHighlight: string;
    explanation: string;
    igcseTip: string;
  }[];
}

export interface ReactionItem {
  id: string;
  chapterId: string;
  titleMs: string;
  typeMs: string;
  difficulty: 'Core (Paper 2)' | 'Extended (Paper 2)' | 'Extended (Paper 4)';
  unbalancedDisplay: string;
  balancedCoeffs: number[];
  reactants: { coeff: number; formula: string; state: string; nameMs: string }[];
  products: { coeff: number; formula: string; state: string; nameMs: string }[];
  ionicSplitReactants: string;
  ionicSplitProducts: string;
  spectatorIons: string[];
  netIonicEquation: string;
  atomAudit: { element: string; nameMs: string; leftUnbalanced: number; rightUnbalanced: number; balancedCount: number }[];
  steps: {
    step: number;
    title: string;
    detail: string;
    equationState: string;
  }[];
  realWorldContext: string;
}

export type WeaknessSkillId =
  | 'valensi_kumpulan'
  | 'logam_peralihan'
  | 'kurungan_poliatomik'
  | 'nisbah_ringkas'
  | 'simbol_keadaan'
  | 'stoikiometri_atom'
  | 'ion_pemerhati'
  | 'persamaan_ionik_bersih';

export interface WeaknessSkillMeta {
  id: WeaknessSkillId;
  titleMs: string;
  chapterId: string;
  commonMistakeMs: string;
  remedyExplanationMs: string;
  workedExample: string;
  recommendedCationId: string;
  recommendedAnionId: string;
}

export interface ChapterMeta {
  id: string;
  number: string;
  titleMs: string;
  subtitleMs: string;
  targetScore: number;
  coreSkills: WeaknessSkillId[];
}

export interface QuizQuestion {
  id: string;
  chapterId: string;
  skillId: WeaknessSkillId;
  paperRef?: string;
  questionMs: string;
  contextFormula?: string;
  options: string[];
  correctIndex: number;
  explanationMs: string;
  wrongDiagnosisMap: Record<number, string>;
}

export interface StudentQuestionResponse {
  questionId: string;
  questionNumber: number;
  paperRef?: string;
  contextFormula?: string;
  questionText: string;
  chosenAnswerText: string;
  correctAnswerText: string;
  isCorrect: boolean;
  markAwarded: number;
  maxMark: number;
  skillId: WeaknessSkillId;
  skillTitle: string;
  wrongAnswerComment: string;
  remedialFeedback: string;
}

export interface QuizAttemptRecord {
  id: string;
  studentName: string;
  studentClass: string;
  chapterId: string;
  timestamp: string;
  dateLabel: string;
  scorePercent: number;
  correctCount: number;
  totalQuestions: number;
  skillBreakdown: Record<WeaknessSkillId, { correct: number; total: number }>;
  wrongQuestionIds: string[];
  questionResponses?: StudentQuestionResponse[];
}

export interface StudentChapterRevision {
  chapterId: string;
  latestScorePercent: number;
  latestCorrectCount: number;
  totalQuestions: number;
  previousScorePercent: number | null;
  attemptsCount: number;
  lastUpdatedTimestamp: string;
}

export interface StudentMasterRecord {
  normalizedKey: string;
  studentName: string;
  studentClass: string;
  totalAttempts: number;
  lastActiveTimestamp: string;
  chapters: Record<string, StudentChapterRevision>;
  overallAverageLatest: number;
}

export const CATIONS: IonItem[] = [
  {
    id: 'na',
    formula: 'Na',
    displayHtml: 'Na⁺',
    charge: 1,
    isPolyatomic: false,
    nameMs: 'Sodium',
    nameEn: 'Sodium',
    category: 'Group I Alkali Metal',
    igcseNote: 'Group I atoms (electronic configuration 2,8,1) lose 1 valence electron to achieve a stable noble gas configuration (2,8).',
    atomicComposition: { Na: 1 },
  },
  {
    id: 'k',
    formula: 'K',
    displayHtml: 'K⁺',
    charge: 1,
    isPolyatomic: false,
    nameMs: 'Potassium',
    nameEn: 'Potassium',
    category: 'Group I Alkali Metal',
    igcseNote: 'Electronic configuration 2,8,8,1 — loses 1 valence electron to form a +1 cation with configuration 2,8,8.',
    atomicComposition: { K: 1 },
  },
  {
    id: 'ag',
    formula: 'Ag',
    displayHtml: 'Ag⁺',
    charge: 1,
    isPolyatomic: false,
    nameMs: 'Silver',
    nameEn: 'Silver',
    category: 'Transition Element (Fixed +1)',
    igcseNote: 'In the Cambridge IGCSE Chemistry Student’s Book, Silver always forms a fixed +1 cation (Ag⁺) without Roman numerals.',
    atomicComposition: { Ag: 1 },
  },
  {
    id: 'nh4',
    formula: 'NH4',
    displayHtml: 'NH₄⁺',
    charge: 1,
    isPolyatomic: true,
    nameMs: 'Ammonium',
    nameEn: 'Ammonium',
    category: 'Compound Cation (Molecular Ion)',
    igcseNote: 'A positively charged compound ion. Must be enclosed in brackets (NH₄) whenever its subscript in a formula unit > 1.',
    atomicComposition: { N: 1, H: 4 },
  },
  {
    id: 'h',
    formula: 'H',
    displayHtml: 'H⁺',
    charge: 1,
    isPolyatomic: false,
    nameMs: 'Hydrogen (Proton)',
    nameEn: 'Hydrogen',
    category: 'Aqueous Acidic Proton',
    igcseNote: 'Acids are proton (H⁺) donors in aqueous solution according to the Brønsted–Lowry definition.',
    atomicComposition: { H: 1 },
  },
  {
    id: 'mg',
    formula: 'Mg',
    displayHtml: 'Mg²⁺',
    charge: 2,
    isPolyatomic: false,
    nameMs: 'Magnesium',
    nameEn: 'Magnesium',
    category: 'Group II Alkaline Earth Metal',
    igcseNote: 'Group II atoms (2,8,2) lose 2 valence electrons to achieve the noble gas electronic configuration 2,8.',
    atomicComposition: { Mg: 1 },
  },
  {
    id: 'ca',
    formula: 'Ca',
    displayHtml: 'Ca²⁺',
    charge: 2,
    isPolyatomic: false,
    nameMs: 'Calcium',
    nameEn: 'Calcium',
    category: 'Group II Alkaline Earth Metal',
    igcseNote: 'Electronic configuration 2,8,8,2 → loses 2 valence electrons to form Ca²⁺ (2,8,8).',
    atomicComposition: { Ca: 1 },
  },
  {
    id: 'ba',
    formula: 'Ba',
    displayHtml: 'Ba²⁺',
    charge: 2,
    isPolyatomic: false,
    nameMs: 'Barium',
    nameEn: 'Barium',
    category: 'Group II Alkaline Earth Metal',
    igcseNote: 'Aqueous Ba²⁺ ions are used in qualitative analysis to test for sulfate ions, precipitating white BaSO₄(s).',
    atomicComposition: { Ba: 1 },
  },
  {
    id: 'zn',
    formula: 'Zn',
    displayHtml: 'Zn²⁺',
    charge: 2,
    isPolyatomic: false,
    nameMs: 'Zinc',
    nameEn: 'Zinc',
    category: 'Transition Block (Fixed +2)',
    igcseNote: 'Zinc always forms a fixed +2 oxidation state (Zn²⁺) without a Roman numeral in systematic naming.',
    atomicComposition: { Zn: 1 },
  },
  {
    id: 'cu2',
    formula: 'Cu',
    displayHtml: 'Cu²⁺',
    charge: 2,
    isPolyatomic: false,
    nameMs: 'Copper(II)',
    nameEn: 'Copper(II)',
    category: 'Transition Element',
    igcseNote: 'Roman numeral (II) denotes the +2 oxidation state. Hydrated Cu²⁺(aq) ions are blue in aqueous solution.',
    atomicComposition: { Cu: 1 },
  },
  {
    id: 'fe2',
    formula: 'Fe',
    displayHtml: 'Fe²⁺',
    charge: 2,
    isPolyatomic: false,
    nameMs: 'Iron(II)',
    nameEn: 'Iron(II)',
    category: 'Transition Element',
    igcseNote: 'Oxidation state +2. Reacts with aqueous NaOH to form a green precipitate of iron(II) hydroxide, Fe(OH)₂(s).',
    atomicComposition: { Fe: 1 },
  },
  {
    id: 'pb2',
    formula: 'Pb',
    displayHtml: 'Pb²⁺',
    charge: 2,
    isPolyatomic: false,
    nameMs: 'Lead(II)',
    nameEn: 'Lead(II)',
    category: 'Group IV (14) Metallic Cation',
    igcseNote: 'Forms insoluble precipitates PbCl₂(s) (white), PbI₂(s) (yellow), and PbSO₄(s) (white).',
    atomicComposition: { Pb: 1 },
  },
  {
    id: 'al',
    formula: 'Al',
    displayHtml: 'Al³⁺',
    charge: 3,
    isPolyatomic: false,
    nameMs: 'Aluminium',
    nameEn: 'Aluminium',
    category: 'Group III (13) Metal',
    igcseNote: 'Electronic configuration 2,8,3 — loses 3 valence electrons to form Al³⁺ (2,8).',
    atomicComposition: { Al: 1 },
  },
  {
    id: 'fe3',
    formula: 'Fe',
    displayHtml: 'Fe³⁺',
    charge: 3,
    isPolyatomic: false,
    nameMs: 'Iron(III)',
    nameEn: 'Iron(III)',
    category: 'Transition Element',
    igcseNote: 'Oxidation state +3. Reacts with aqueous NaOH to form a reddish-brown precipitate of iron(III) hydroxide, Fe(OH)₃(s).',
    atomicComposition: { Fe: 1 },
  },
];

export const ANIONS: IonItem[] = [
  {
    id: 'cl',
    formula: 'Cl',
    displayHtml: 'Cl⁻',
    charge: -1,
    isPolyatomic: false,
    nameMs: 'chloride',
    nameEn: 'chloride',
    category: 'Group VII (17) Halide',
    igcseNote: 'Group VII halogen atoms (2,8,7) gain 1 electron to achieve a noble gas electronic configuration (2,8,8).',
    atomicComposition: { Cl: 1 },
  },
  {
    id: 'br',
    formula: 'Br',
    displayHtml: 'Br⁻',
    charge: -1,
    isPolyatomic: false,
    nameMs: 'bromide',
    nameEn: 'bromide',
    category: 'Group VII (17) Halide',
    igcseNote: 'Monoatomic halide anion with a −1 charge. Forms a cream precipitate of AgBr(s) with acidified silver nitrate.',
    atomicComposition: { Br: 1 },
  },
  {
    id: 'i',
    formula: 'I',
    displayHtml: 'I⁻',
    charge: -1,
    isPolyatomic: false,
    nameMs: 'iodide',
    nameEn: 'iodide',
    category: 'Group VII (17) Halide',
    igcseNote: 'Monoatomic halide anion with a −1 charge. Forms a yellow precipitate of AgI(s) with acidified silver nitrate.',
    atomicComposition: { I: 1 },
  },
  {
    id: 'oh',
    formula: 'OH',
    displayHtml: 'OH⁻',
    charge: -1,
    isPolyatomic: true,
    nameMs: 'hydroxide',
    nameEn: 'hydroxide',
    category: 'Compound Anion (Molecular Ion)',
    igcseNote: 'Compound ion carrying a single negative charge (−1). Must be enclosed in brackets when multiplied, e.g. Ca(OH)₂.',
    atomicComposition: { O: 1, H: 1 },
  },
  {
    id: 'no3',
    formula: 'NO3',
    displayHtml: 'NO₃⁻',
    charge: -1,
    isPolyatomic: true,
    nameMs: 'nitrate',
    nameEn: 'nitrate',
    category: 'Compound Anion (Oxyanion)',
    igcseNote: 'All nitrates are soluble in water (aq). Enclose in brackets when subscript > 1, e.g. Pb(NO₃)₂.',
    atomicComposition: { N: 1, O: 3 },
  },
  {
    id: 'o',
    formula: 'O',
    displayHtml: 'O²⁻',
    charge: -2,
    isPolyatomic: false,
    nameMs: 'oxide',
    nameEn: 'oxide',
    category: 'Group VI (16) Anion',
    igcseNote: 'Oxygen atoms (2,6) gain 2 electrons to achieve the noble gas electronic configuration 2,8.',
    atomicComposition: { O: 1 },
  },
  {
    id: 's',
    formula: 'S',
    displayHtml: 'S²⁻',
    charge: -2,
    isPolyatomic: false,
    nameMs: 'sulfide',
    nameEn: 'sulfide',
    category: 'Group VI (16) Anion',
    igcseNote: 'Monoatomic sulfide ion (S²⁻, 2,8,8). Do not confuse "-ide" (monoatomic S²⁻) with "-ate" (compound oxyanion SO₄²⁻).',
    atomicComposition: { S: 1 },
  },
  {
    id: 'so4',
    formula: 'SO4',
    displayHtml: 'SO₄²⁻',
    charge: -2,
    isPolyatomic: true,
    nameMs: 'sulfate',
    nameEn: 'sulfate',
    category: 'Compound Anion (Oxyanion)',
    igcseNote: 'Compound sulfate(VI) ion with a −2 charge. Combines with Al³⁺ to form Al₂(SO₄)₃.',
    atomicComposition: { S: 1, O: 4 },
  },
  {
    id: 'co3',
    formula: 'CO3',
    displayHtml: 'CO₃²⁻',
    charge: -2,
    isPolyatomic: true,
    nameMs: 'carbonate',
    nameEn: 'carbonate',
    category: 'Compound Anion (Oxyanion)',
    igcseNote: 'Compound ion with a −2 charge. Reacts with dilute acids to produce carbon dioxide gas, CO₂(g).',
    atomicComposition: { C: 1, O: 3 },
  },
  {
    id: 'po4',
    formula: 'PO4',
    displayHtml: 'PO₄³⁻',
    charge: -3,
    isPolyatomic: true,
    nameMs: 'phosphate',
    nameEn: 'phosphate',
    category: 'Compound Anion (Oxyanion)',
    igcseNote: 'Compound ion with a −3 charge. Combines with Ca²⁺ (+2) to form calcium phosphate, Ca₃(PO₄)₂.',
    atomicComposition: { P: 1, O: 4 },
  },
  {
    id: 'n',
    formula: 'N',
    displayHtml: 'N³⁻',
    charge: -3,
    isPolyatomic: false,
    nameMs: 'nitride',
    nameEn: 'nitride',
    category: 'Group V (15) Anion',
    igcseNote: 'Group V nitrogen atoms (2,5) gain 3 electrons to form the monoatomic nitride ion N³⁻ (2,8).',
    atomicComposition: { N: 1 },
  },
];

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * Normalizes any accidental numeral '0' or subscript '₀' used in place of the
 * chemical element symbol Oxygen ('O') into the uppercase alphabet letter 'O'
 * (e.g. S04 -> SO4, S0 -> SO, C03 -> CO3, N03 -> NO3, P04 -> PO4, 0H -> OH, H20 -> H2O).
 */
export function normalizeFormulaOxygenLetter(formula: string): string {
  return formula
    .replace(/([SCNP])(?:0|₀)/gi, (_, el: string) => `${el.toUpperCase()}O`)
    .replace(/(?:0|₀)H/gi, 'OH')
    .replace(/H([2₂])(?:0|₀)/gi, 'H$1O');
}

export function formatFormulaWithSubscripts(formula: string): string {
  const normalized = normalizeFormulaOxygenLetter(formula);
  const subMap: Record<string, string> = {
    '0': '₀',
    '1': '₁',
    '2': '₂',
    '3': '₃',
    '4': '₄',
    '5': '₅',
    '6': '₆',
    '7': '₇',
    '8': '₈',
    '9': '₉',
  };
  return normalized.replace(/\d+/g, (match) =>
    match
      .split('')
      .map((d) => subMap[d] || d)
      .join('')
  );
}

export function balanceIonicCompound(cation: IonItem, anion: IonItem): BalancedCompoundResult {
  const posCharge = Math.abs(cation.charge);
  const negCharge = Math.abs(anion.charge);

  const commonDivisor = gcd(posCharge, negCharge);
  const cationCount = negCharge / commonDivisor;
  const anionCount = posCharge / commonDivisor;
  const wasSimplified = commonDivisor > 1;
  const lcmCharge = (posCharge * negCharge) / commonDivisor;

  const needsCationBrackets = cation.isPolyatomic && cationCount > 1;
  const needsAnionBrackets = anion.isPolyatomic && anionCount > 1;

  const catPart = needsCationBrackets
    ? `(${cation.formula})${cationCount}`
    : `${cation.formula}${cationCount > 1 ? cationCount : ''}`;

  const anPart = needsAnionBrackets
    ? `(${anion.formula})${anionCount}`
    : `${anion.formula}${anionCount > 1 ? anionCount : ''}`;

  const formulaPlain = `${catPart}${anPart}`;

  let compoundNameMs = `${cation.nameEn} ${anion.nameEn}`;
  let compoundNameEn = `${cation.nameEn} ${anion.nameEn}`;
  if (cation.id === 'h') {
    if (anion.id === 'cl') {
      compoundNameMs = 'Hydrochloric acid (Hydrogen chloride)';
      compoundNameEn = 'Hydrochloric acid (Hydrogen chloride)';
    } else if (anion.id === 'so4') {
      compoundNameMs = 'Sulfuric acid (Hydrogen sulfate)';
      compoundNameEn = 'Sulfuric acid (Hydrogen sulfate)';
    } else if (anion.id === 'no3') {
      compoundNameMs = 'Nitric acid (Hydrogen nitrate)';
      compoundNameEn = 'Nitric acid (Hydrogen nitrate)';
    } else if (anion.id === 'oh') {
      compoundNameMs = 'Water (H₂O)';
      compoundNameEn = 'Water (H₂O)';
    }
  }

  const steps = [
    {
      stepNumber: 1,
      title: 'Deduce Cation & Anion Valency Charges',
      formulaHighlight: `${cation.displayHtml}   +   ${anion.displayHtml}`,
      explanation: `The positive cation is ${cation.nameEn} (${cation.displayHtml}) with an ionic charge of ${posCharge}+, and the negative anion is ${anion.nameEn} (${anion.displayHtml}) with an ionic charge of ${negCharge}−.`,
      igcseTip: cation.igcseNote,
    },
    {
      stepNumber: 2,
      title: 'Apply Criss-Cross Method to Find Empirical Formula Ratio',
      formulaHighlight: wasSimplified
        ? `Uncancelled Ratio ${negCharge} : ${posCharge}  →  Empirical Ratio ${cationCount} : ${anionCount}`
        : `Cross Charge Magnitudes  →  ${cationCount} ${cation.formula} : ${anionCount} ${anion.formula}`,
      explanation: wasSimplified
        ? `Crossing the charge magnitudes gives ${negCharge} and ${posCharge}, which are both divisible by ${commonDivisor}. As defined in the Cambridge IGCSE Chemistry Student's Book, the formula of an ionic compound is always its empirical formula—the simplest whole-number ratio of ions in the giant ionic lattice (${cationCount}:${anionCount}).`
        : `Swap the numerical charge magnitudes without (+/-) signs: the ${negCharge} from ${anion.displayHtml} becomes the subscript of ${cation.formula}, and the ${posCharge} from ${cation.displayHtml} becomes the subscript of ${anion.formula}.`,
      igcseTip: 'Cambridge IGCSE Rule: Ionic charges (+ or −) must never appear in the final empirical formula subscripts.',
    },
    {
      stepNumber: 3,
      title: 'Compound Ion (Molecular Ion) Bracket Rule',
      formulaHighlight:
        needsCationBrackets || needsAnionBrackets
          ? `Brackets Mandatory: ${formatFormulaWithSubscripts(formulaPlain)}`
          : `No Brackets Required: ${formatFormulaWithSubscripts(formulaPlain)}`,
      explanation:
        needsCationBrackets || needsAnionBrackets
          ? `Because ${needsCationBrackets ? cation.displayHtml : ''}${needsCationBrackets && needsAnionBrackets ? ' and ' : ''}${needsAnionBrackets ? anion.displayHtml : ''} is a compound ion (multiple covalently bonded atoms carrying an overall charge) with a subscript greater than 1, brackets MUST enclose the entire compound ion.`
          : `No compound ion has a subscript greater than 1 in this formula unit. Do not place brackets around monoatomic ions (e.g. writing Mg(Cl)₂ is penalised in Paper 4).`,
      igcseTip: anion.igcseNote,
    },
    {
      stepNumber: 4,
      title: 'Confirm Electrical Neutrality of the Giant Ionic Lattice',
      formulaHighlight: `(${cationCount} × +${posCharge}) + (${anionCount} × −${negCharge}) = +${lcmCharge} − ${lcmCharge} = 0`,
      explanation: `A giant ionic lattice must have zero net electrical charge. ${cationCount} ${cation.displayHtml} cation(s) supply +${lcmCharge}, balancing ${anionCount} ${anion.displayHtml} anion(s) supplying −${lcmCharge}.`,
      igcseTip: `Verified empirical formula: ${formatFormulaWithSubscripts(formulaPlain)} (${compoundNameEn}).`,
    },
  ];

  return {
    cation,
    anion,
    cationCount,
    anionCount,
    rawRatioCation: negCharge,
    rawRatioAnion: posCharge,
    wasSimplified,
    needsCationBrackets,
    needsAnionBrackets,
    formulaPlain: cation.id === 'h' && anion.id === 'oh' ? 'H2O' : formulaPlain,
    compoundNameMs,
    compoundNameEn,
    totalPositiveCharge: lcmCharge,
    totalNegativeCharge: -lcmCharge,
    lcmCharge,
    steps,
  };
}

export function parseCustomIonQuery(query: string): { cation: IonItem; anion: IonItem } | null {
  const cleaned = normalizeFormulaOxygenLetter(query.trim()).toLowerCase();
  if (!cleaned) return null;

  let matchedCation: IonItem | undefined;
  let matchedAnion: IonItem | undefined;

  const sortedCations = [...CATIONS].sort((a, b) => b.id.length - a.id.length);
  const sortedAnions = [...ANIONS].sort((a, b) => b.id.length - a.id.length);

  for (const c of sortedCations) {
    const patterns = [
      c.id.toLowerCase(),
      c.formula.toLowerCase() + c.charge + '+',
      c.formula.toLowerCase() + '+' + c.charge,
      c.nameMs.toLowerCase(),
      c.nameEn.toLowerCase(),
      c.formula.toLowerCase(),
    ];
    if (patterns.some((p) => cleaned.includes(p))) {
      matchedCation = c;
      break;
    }
  }

  for (const a of sortedAnions) {
    const patterns = [
      a.id.toLowerCase(),
      a.formula.toLowerCase() + Math.abs(a.charge) + '-',
      a.nameMs.toLowerCase(),
      a.nameEn.toLowerCase(),
      a.formula.toLowerCase(),
    ];
    if (patterns.some((p) => cleaned.includes(p))) {
      matchedAnion = a;
      break;
    }
  }

  if (matchedCation && matchedAnion) {
    return { cation: matchedCation, anion: matchedAnion };
  }
  return null;
}

export const CHAPTERS: ChapterMeta[] = [
  {
    id: 'bab1',
    number: 'Chapter 01',
    titleMs: 'Atomic Structure, Electronic Configuration & Ions',
    subtitleMs: 'Cambridge IGCSE Paper 2 & 4 (10 Questions): Noble gas configurations, group valency & transition elements',
    targetScore: 80,
    coreSkills: ['valensi_kumpulan', 'logam_peralihan'],
  },
  {
    id: 'bab2',
    number: 'Chapter 02',
    titleMs: 'Formulae of Ionic Compounds & Compound Ions',
    subtitleMs: 'Cambridge IGCSE Paper 2 & 4 (10 Questions): Empirical ratios, compound ions & charge neutralisation',
    targetScore: 80,
    coreSkills: ['kurungan_poliatomik', 'nisbah_ringkas'],
  },
  {
    id: 'bab3',
    number: 'Chapter 03',
    titleMs: 'Stoichiometry, Symbol Equations & State Symbols',
    subtitleMs: 'Cambridge IGCSE Paper 2 & 4 (10 Questions): Balancing symbol equations, Mᵣ & state symbols (s, l, g, aq)',
    targetScore: 80,
    coreSkills: ['stoikiometri_atom', 'simbol_keadaan'],
  },
  {
    id: 'bab4',
    number: 'Chapter 04',
    titleMs: 'Ionic Equations, Spectator Ions & Precipitation',
    subtitleMs: 'Cambridge IGCSE Paper 2 & 4 (10 Questions): Net ionic equations, spectator ions & qualitative tests',
    targetScore: 80,
    coreSkills: ['ion_pemerhati', 'persamaan_ionik_bersih'],
  },
];

export const WEAKNESS_SKILLS: Record<WeaknessSkillId, WeaknessSkillMeta> = {
  valensi_kumpulan: {
    id: 'valensi_kumpulan',
    titleMs: 'Electronic Configuration & Periodic Group Valency',
    chapterId: 'bab1',
    commonMistakeMs: 'Confusing the number of valence electrons with the ionic charge for Group V, VI, and VII non-metals.',
    remedyExplanationMs:
      'Atoms react to achieve a noble gas electronic configuration (full outer shell of 8 valence electrons). Group I (+1), II (+2), and III (+3) metals lose valence electrons. Group V (−3), VI (−2), and VII (−1) non-metals gain (8 − group number) valence electrons.',
    workedExample: 'Oxygen (Group VI, configuration 2,6) gains 2 electrons to form O²⁻ (2,8), never O⁶⁻.',
    recommendedCationId: 'al',
    recommendedAnionId: 'o',
  },
  logam_peralihan: {
    id: 'logam_peralihan',
    titleMs: 'Transition Element Oxidation States (Roman Numerals)',
    chapterId: 'bab1',
    commonMistakeMs: 'Treating Roman numerals such as Iron(III) as a subscript of 3 atoms (Fe₃) instead of the +3 oxidation state (Fe³⁺).',
    remedyExplanationMs:
      'In Cambridge IGCSE nomenclature, Roman numerals indicate the oxidation state (positive charge) of a transition element ion: (I) = +1, (II) = +2, (III) = +3. Recall also that Zinc is fixed at Zn²⁺ and Silver at Ag⁺.',
    workedExample: 'Iron(III) chloride contains Fe³⁺ and Cl⁻ ions → empirical formula FeCl₃ (not Fe₃Cl).',
    recommendedCationId: 'fe3',
    recommendedAnionId: 'cl',
  },
  kurungan_poliatomik: {
    id: 'kurungan_poliatomik',
    titleMs: 'Compound Ion (Molecular Ion) Brackets',
    chapterId: 'bab2',
    commonMistakeMs: 'Omitting brackets around a compound ion when its subscript in the formula unit is 2 or more (e.g. writing CaOH₂ or Al₂SO₄₃).',
    remedyExplanationMs:
      'Compound ions (NH₄⁺, OH⁻, NO₃⁻, SO₄²⁻, CO₃²⁻, PO₄³⁻) act as a single charged unit. If more than one unit is required to balance the net charge, enclose the entire formula of the compound ion in brackets.',
    workedExample: 'Ca²⁺ + 2 OH⁻ → Ca(OH)₂. Writing CaOH₂ wrongly represents only 1 oxygen atom.',
    recommendedCationId: 'ca',
    recommendedAnionId: 'oh',
  },
  nisbah_ringkas: {
    id: 'nisbah_ringkas',
    titleMs: 'Empirical Formula Simplest Whole-Number Ratio',
    chapterId: 'bab2',
    commonMistakeMs: 'Leaving ionic subscripts uncancelled after crossing charges (e.g. writing Mg₂O₂ or Cu₂(CO₃)₂).',
    remedyExplanationMs:
      'Ionic compounds form a continuous giant ionic lattice rather than discrete molecules. Their chemical formula is always the empirical formula—the simplest whole-number ratio of cations to anions.',
    workedExample: 'Mg²⁺ (+2) and O²⁻ (−2) combine in a 2:2 ratio, which simplifies to 1:1 → MgO.',
    recommendedCationId: 'mg',
    recommendedAnionId: 'o',
  },
  stoikiometri_atom: {
    id: 'stoikiometri_atom',
    titleMs: 'Stoichiometric Symbol Equation Balancing',
    chapterId: 'bab3',
    commonMistakeMs: 'Altering subscripts inside chemical formulas instead of adjusting stoichiometric coefficients in front of formulas.',
    remedyExplanationMs:
      'Once each substance’s chemical formula is deduced from valency, subscripts cannot be changed. Place stoichiometric coefficients in front of formulas to conserve the number of atoms of each element.',
    workedExample: '4Al(s) + 3O₂(g) → 2Al₂O₃(s) balances 4 Al atoms and 6 O atoms on both sides.',
    recommendedCationId: 'al',
    recommendedAnionId: 'o',
  },
  simbol_keadaan: {
    id: 'simbol_keadaan',
    titleMs: 'Cambridge IGCSE State Symbols (s, l, g, aq)',
    chapterId: 'bab3',
    commonMistakeMs: 'Writing H₂O(aq) instead of H₂O(l), or confusing molten electrolytes (l) with aqueous solutions (aq).',
    remedyExplanationMs:
      'Use (s) for solids and insoluble precipitates, (l) for pure liquids such as water H₂O(l) or molten ionic compounds, (g) for gases, and (aq) exclusively for substances dissolved in water.',
    workedExample: 'CaCO₃(s) + 2HCl(aq) → CaCl₂(aq) + H₂O(l) + CO₂(g).',
    recommendedCationId: 'ca',
    recommendedAnionId: 'cl',
  },
  ion_pemerhati: {
    id: 'ion_pemerhati',
    titleMs: 'Identifying Spectator Ions in Solution',
    chapterId: 'bab4',
    commonMistakeMs: 'Failing to cancel aqueous ions that remain unchanged in state and charge on both sides of the equation.',
    remedyExplanationMs:
      'Dissociate all soluble aqueous electrolytes (aq) into free ions. Any ion that appears identically as (aq) on both the reactant and product sides is a spectator ion and cancels out.',
    workedExample: 'In Pb(NO₃)₂(aq) + 2KI(aq) → PbI₂(s) + 2KNO₃(aq), K⁺(aq) and NO₃⁻(aq) are spectator ions.',
    recommendedCationId: 'pb2',
    recommendedAnionId: 'i',
  },
  persamaan_ionik_bersih: {
    id: 'persamaan_ionik_bersih',
    titleMs: 'Constructing Net Ionic Equations',
    chapterId: 'bab4',
    commonMistakeMs: 'Splitting insoluble precipitates (s), uncombined metals (s), gases (g), or covalent water H₂O(l) into ions.',
    remedyExplanationMs:
      'Only soluble (aq) electrolytes split into ions. Keep precipitates (s), solid metals (s), covalent liquids like H₂O(l), and gases (g) intact as complete formulas.',
    workedExample: 'Neutralisation net ionic equation: H⁺(aq) + OH⁻(aq) → H₂O(l).',
    recommendedCationId: 'h',
    recommendedAnionId: 'oh',
  },
};

export const REACTIONS_DATA: ReactionItem[] = [
  {
    id: 'rxn-1',
    chapterId: 'bab4',
    titleMs: 'Precipitation of Silver Chloride (Halide Test)',
    typeMs: 'Ionic Precipitation (Insoluble Salt Formation)',
    difficulty: 'Core (Paper 2)',
    unbalancedDisplay: 'AgNO₃(aq) + NaCl(aq) → AgCl(s) + NaNO₃(aq)',
    balancedCoeffs: [1, 1, 1, 1],
    reactants: [
      { coeff: 1, formula: 'AgNO₃', state: '(aq)', nameMs: 'Silver nitrate' },
      { coeff: 1, formula: 'NaCl', state: '(aq)', nameMs: 'Sodium chloride' },
    ],
    products: [
      { coeff: 1, formula: 'AgCl', state: '(s)', nameMs: 'Silver chloride (white precipitate)' },
      { coeff: 1, formula: 'NaNO₃', state: '(aq)', nameMs: 'Sodium nitrate' },
    ],
    ionicSplitReactants: 'Ag⁺(aq) + NO₃⁻(aq) + Na⁺(aq) + Cl⁻(aq)',
    ionicSplitProducts: 'AgCl(s) + Na⁺(aq) + NO₃⁻(aq)',
    spectatorIons: ['Na⁺(aq)', 'NO₃⁻(aq)'],
    netIonicEquation: 'Ag⁺(aq) + Cl⁻(aq) → AgCl(s)',
    atomAudit: [
      { element: 'Ag', nameMs: 'Silver', leftUnbalanced: 1, rightUnbalanced: 1, balancedCount: 1 },
      { element: 'NO₃', nameMs: 'Nitrate compound ion', leftUnbalanced: 1, rightUnbalanced: 1, balancedCount: 1 },
      { element: 'Na', nameMs: 'Sodium', leftUnbalanced: 1, rightUnbalanced: 1, balancedCount: 1 },
      { element: 'Cl', nameMs: 'Chlorine', leftUnbalanced: 1, rightUnbalanced: 1, balancedCount: 1 },
    ],
    steps: [
      {
        step: 1,
        title: 'Write the Balanced Symbol Equation with State Symbols',
        detail: 'All ions react in a 1:1 stoichiometric ratio. Silver chloride is insoluble in water so it receives the solid state symbol (s), whereas soluble salts remain (aq).',
        equationState: 'AgNO₃(aq) + NaCl(aq) → AgCl(s) + NaNO₃(aq)',
      },
      {
        step: 2,
        title: 'Dissociate Soluble Aqueous Electrolytes (aq) into Free Ions',
        detail: 'Aqueous ionic compounds split into mobile solvated ions. The insoluble solid precipitate AgCl(s) remains intact in its giant ionic lattice.',
        equationState: 'Ag⁺(aq) + NO₃⁻(aq) + Na⁺(aq) + Cl⁻(aq) → AgCl(s) + Na⁺(aq) + NO₃⁻(aq)',
      },
      {
        step: 3,
        title: 'Identify & Cancel Spectator Ions',
        detail: 'Na⁺(aq) and NO₃⁻(aq) remain unchanged in solution on both sides of the equation and do not take part in the chemical change.',
        equationState: 'Ag⁺(aq) + [NO₃⁻] + [Na⁺] + Cl⁻(aq) → AgCl(s) + [Na⁺] + [NO₃⁻]',
      },
      {
        step: 4,
        title: 'State the Final Net Ionic Equation',
        detail: 'Retain only the reacting ions that form the precipitate. Check conservation of charge: (+1) + (−1) = 0 on both sides.',
        equationState: 'Ag⁺(aq) + Cl⁻(aq) → AgCl(s)',
      },
    ],
    realWorldContext: 'Cambridge IGCSE Syllabus 12.3 Qualitative Analysis: Acidified aqueous silver nitrate is used to identify halide ions (Cl⁻ gives white AgCl, Br⁻ gives cream AgBr, I⁻ gives yellow AgI).',
  },
  {
    id: 'rxn-2',
    chapterId: 'bab3',
    titleMs: 'Neutralisation of Sulfuric Acid & Sodium Hydroxide',
    typeMs: 'Diprotic Acid + Alkali Neutralisation',
    difficulty: 'Extended (Paper 2)',
    unbalancedDisplay: 'H₂SO₄(aq) + NaOH(aq) → Na₂SO₄(aq) + H₂O(l)',
    balancedCoeffs: [1, 2, 1, 2],
    reactants: [
      { coeff: 1, formula: 'H₂SO₄', state: '(aq)', nameMs: 'Sulfuric acid' },
      { coeff: 2, formula: 'NaOH', state: '(aq)', nameMs: 'Sodium hydroxide' },
    ],
    products: [
      { coeff: 1, formula: 'Na₂SO₄', state: '(aq)', nameMs: 'Sodium sulfate' },
      { coeff: 2, formula: 'H₂O', state: '(l)', nameMs: 'Water (pure liquid)' },
    ],
    ionicSplitReactants: '2H⁺(aq) + SO₄²⁻(aq) + 2Na⁺(aq) + 2OH⁻(aq)',
    ionicSplitProducts: '2Na⁺(aq) + SO₄²⁻(aq) + 2H₂O(l)',
    spectatorIons: ['2Na⁺(aq)', 'SO₄²⁻(aq)'],
    netIonicEquation: 'H⁺(aq) + OH⁻(aq) → H₂O(l)',
    atomAudit: [
      { element: 'Na', nameMs: 'Sodium', leftUnbalanced: 1, rightUnbalanced: 2, balancedCount: 2 },
      { element: 'SO₄', nameMs: 'Sulfate compound ion', leftUnbalanced: 1, rightUnbalanced: 1, balancedCount: 1 },
      { element: 'H', nameMs: 'Hydrogen', leftUnbalanced: 3, rightUnbalanced: 2, balancedCount: 4 },
      { element: 'O (non-SO₄)', nameMs: 'Hydroxide Oxygen', leftUnbalanced: 1, rightUnbalanced: 1, balancedCount: 2 },
    ],
    steps: [
      {
        step: 1,
        title: 'Balance Sodium (Na) Ions & Sulfate (SO₄²⁻) Groups',
        detail: 'Sodium sulfate has the empirical formula Na₂SO₄ because two Na⁺ ions balance one SO₄²⁻ ion. Place a stoichiometric coefficient of 2 in front of NaOH.',
        equationState: 'H₂SO₄(aq) + 2NaOH(aq) → Na₂SO₄(aq) + H₂O(l)',
      },
      {
        step: 2,
        title: 'Balance Hydrogen (H) & Oxygen (O) Atoms in Water',
        detail: 'The reactants now contain 2 H from H₂SO₄ + 2 H from 2NaOH = 4 H atoms. Place a coefficient of 2 in front of H₂O(l).',
        equationState: 'H₂SO₄(aq) + 2NaOH(aq) → Na₂SO₄(aq) + 2H₂O(l)',
      },
      {
        step: 3,
        title: 'Dissociate Strong Electrolytes & Keep Covalent Water (l) Intact',
        detail: 'Water H₂O(l) is a simple molecular covalent liquid and does not ionise. 2Na⁺(aq) and SO₄²⁻(aq) are spectator ions.',
        equationState: '2H⁺(aq) + SO₄²⁻(aq) + 2Na⁺(aq) + 2OH⁻(aq) → 2Na⁺(aq) + SO₄²⁻(aq) + 2H₂O(l)',
      },
      {
        step: 4,
        title: 'Simplify to the Universal Neutralisation Ionic Equation',
        detail: 'Cancelling spectator ions leaves 2H⁺(aq) + 2OH⁻(aq) → 2H₂O(l), which simplifies by dividing by 2.',
        equationState: 'H⁺(aq) + OH⁻(aq) → H₂O(l)',
      },
    ],
    realWorldContext: 'Cambridge IGCSE Syllabus 7.1 Acids and Bases: Diprotic H₂SO₄ donates 2 moles of H⁺ protons per mole of acid in acid-alkali titrations.',
  },
  {
    id: 'rxn-3',
    chapterId: 'bab4',
    titleMs: 'Precipitation of Lead(II) Iodide',
    typeMs: 'Ionic Precipitation (Insoluble Salt Preparation)',
    difficulty: 'Extended (Paper 4)',
    unbalancedDisplay: 'Pb(NO₃)₂(aq) + KI(aq) → PbI₂(s) + KNO₃(aq)',
    balancedCoeffs: [1, 2, 1, 2],
    reactants: [
      { coeff: 1, formula: 'Pb(NO₃)₂', state: '(aq)', nameMs: 'Lead(II) nitrate' },
      { coeff: 2, formula: 'KI', state: '(aq)', nameMs: 'Potassium iodide' },
    ],
    products: [
      { coeff: 1, formula: 'PbI₂', state: '(s)', nameMs: 'Lead(II) iodide (yellow precipitate)' },
      { coeff: 2, formula: 'KNO₃', state: '(aq)', nameMs: 'Potassium nitrate' },
    ],
    ionicSplitReactants: 'Pb²⁺(aq) + 2NO₃⁻(aq) + 2K⁺(aq) + 2I⁻(aq)',
    ionicSplitProducts: 'PbI₂(s) + 2K⁺(aq) + 2NO₃⁻(aq)',
    spectatorIons: ['2K⁺(aq)', '2NO₃⁻(aq)'],
    netIonicEquation: 'Pb²⁺(aq) + 2I⁻(aq) → PbI₂(s)',
    atomAudit: [
      { element: 'Pb', nameMs: 'Lead', leftUnbalanced: 1, rightUnbalanced: 1, balancedCount: 1 },
      { element: 'NO₃', nameMs: 'Nitrate compound ion', leftUnbalanced: 2, rightUnbalanced: 1, balancedCount: 2 },
      { element: 'K', nameMs: 'Potassium', leftUnbalanced: 1, rightUnbalanced: 1, balancedCount: 2 },
      { element: 'I', nameMs: 'Iodine', leftUnbalanced: 1, rightUnbalanced: 2, balancedCount: 2 },
    ],
    steps: [
      {
        step: 1,
        title: 'Inspect Compound Ion Brackets in Pb(NO₃)₂ & PbI₂',
        detail: 'Because Lead(II) has a +2 charge (Pb²⁺), it bonds with 2 NO₃⁻ ions in the reactant and 2 I⁻ ions in the precipitate.',
        equationState: 'Pb(NO₃)₂(aq) + KI(aq) → PbI₂(s) + KNO₃(aq)',
      },
      {
        step: 2,
        title: 'Balance Stoichiometric Coefficients for KI and KNO₃',
        detail: 'Place a coefficient of 2 in front of KI to supply 2 I⁻ ions, and a coefficient of 2 in front of KNO₃ to balance K⁺ and NO₃⁻.',
        equationState: 'Pb(NO₃)₂(aq) + 2KI(aq) → PbI₂(s) + 2KNO₃(aq)',
      },
      {
        step: 3,
        title: 'Cancel Spectator Ions 2K⁺(aq) and 2NO₃⁻(aq)',
        detail: 'Potassium and nitrate ions remain dissolved in aqueous solution before and after precipitation.',
        equationState: 'Pb²⁺(aq) + 2I⁻(aq) → PbI₂(s)',
      },
      {
        step: 4,
        title: 'Verify Conservation of Mass & Charge',
        detail: 'Left side net charge: (+2) + 2(−1) = 0. Right side charge: PbI₂(s) = 0.',
        equationState: 'Pb²⁺(aq) + 2I⁻(aq) → PbI₂(s)',
      },
    ],
    realWorldContext: 'Cambridge IGCSE Syllabus 7.2 Preparation of Salts: Insoluble salts such as PbI₂(s) are prepared by precipitation, then filtered, washed with distilled water, and dried.',
  },
  {
    id: 'rxn-4',
    chapterId: 'bab3',
    titleMs: 'Reaction of Calcium Carbonate with Hydrochloric Acid',
    typeMs: 'Acid + Metal Carbonate → Salt + Water + CO₂(g)',
    difficulty: 'Extended (Paper 4)',
    unbalancedDisplay: 'CaCO₃(s) + HCl(aq) → CaCl₂(aq) + H₂O(l) + CO₂(g)',
    balancedCoeffs: [1, 2, 1, 1, 1],
    reactants: [
      { coeff: 1, formula: 'CaCO₃', state: '(s)', nameMs: 'Calcium carbonate (Marble chips)' },
      { coeff: 2, formula: 'HCl', state: '(aq)', nameMs: 'Hydrochloric acid' },
    ],
    products: [
      { coeff: 1, formula: 'CaCl₂', state: '(aq)', nameMs: 'Calcium chloride' },
      { coeff: 1, formula: 'H₂O', state: '(l)', nameMs: 'Water' },
      { coeff: 1, formula: 'CO₂', state: '(g)', nameMs: 'Carbon dioxide gas' },
    ],
    ionicSplitReactants: 'CaCO₃(s) + 2H⁺(aq) + 2Cl⁻(aq)',
    ionicSplitProducts: 'Ca²⁺(aq) + 2Cl⁻(aq) + H₂O(l) + CO₂(g)',
    spectatorIons: ['2Cl⁻(aq)'],
    netIonicEquation: 'CaCO₃(s) + 2H⁺(aq) → Ca²⁺(aq) + H₂O(l) + CO₂(g)',
    atomAudit: [
      { element: 'Ca', nameMs: 'Calcium', leftUnbalanced: 1, rightUnbalanced: 1, balancedCount: 1 },
      { element: 'C', nameMs: 'Carbon', leftUnbalanced: 1, rightUnbalanced: 1, balancedCount: 1 },
      { element: 'O', nameMs: 'Oxygen', leftUnbalanced: 3, rightUnbalanced: 3, balancedCount: 3 },
      { element: 'H', nameMs: 'Hydrogen', leftUnbalanced: 1, rightUnbalanced: 2, balancedCount: 2 },
      { element: 'Cl', nameMs: 'Chlorine', leftUnbalanced: 1, rightUnbalanced: 2, balancedCount: 2 },
    ],
    steps: [
      {
        step: 1,
        title: 'Deduce Empirical Formula of Calcium Chloride (CaCl₂)',
        detail: 'Group II Ca²⁺ and Group VII Cl⁻ form CaCl₂. Place a coefficient of 2 in front of HCl(aq) to balance chlorine and hydrogen.',
        equationState: 'CaCO₃(s) + 2HCl(aq) → CaCl₂(aq) + H₂O(l) + CO₂(g)',
      },
      {
        step: 2,
        title: 'Retain Insoluble Solid CaCO₃(s) in the Ionic Equation',
        detail: 'Because marble chips CaCO₃(s) are an insoluble solid, they do not dissociate into free aqueous ions on the reactant side.',
        equationState: 'CaCO₃(s) + 2H⁺(aq) + 2Cl⁻(aq) → Ca²⁺(aq) + 2Cl⁻(aq) + H₂O(l) + CO₂(g)',
      },
      {
        step: 3,
        title: 'Cancel Spectator Ion 2Cl⁻(aq)',
        detail: 'Only the chloride ions 2Cl⁻(aq) remain unchanged in aqueous solution on both sides.',
        equationState: 'CaCO₃(s) + 2H⁺(aq) → Ca²⁺(aq) + H₂O(l) + CO₂(g)',
      },
      {
        step: 4,
        title: 'Verify Net Charge & Atom Balance',
        detail: 'Reactant charge: 0 + 2(+1) = +2. Product charge: Ca²⁺ (+2) + 0 + 0 = +2.',
        equationState: 'CaCO₃(s) + 2H⁺(aq) → Ca²⁺(aq) + H₂O(l) + CO₂(g)',
      },
    ],
    realWorldContext: 'Cambridge IGCSE Syllabus 6.1 Rate of Reaction & 12.3 Carbonate Test: Effervescence of CO₂(g) turns aqueous calcium hydroxide (limewater) milky.',
  },
  {
    id: 'rxn-5',
    chapterId: 'bab4',
    titleMs: 'Precipitation of Iron(III) Hydroxide (Cation Analysis)',
    typeMs: 'Qualitative Analysis Cation Precipitation',
    difficulty: 'Extended (Paper 4)',
    unbalancedDisplay: 'FeCl₃(aq) + NaOH(aq) → Fe(OH)₃(s) + NaCl(aq)',
    balancedCoeffs: [1, 3, 1, 3],
    reactants: [
      { coeff: 1, formula: 'FeCl₃', state: '(aq)', nameMs: 'Iron(III) chloride' },
      { coeff: 3, formula: 'NaOH', state: '(aq)', nameMs: 'Sodium hydroxide' },
    ],
    products: [
      { coeff: 1, formula: 'Fe(OH)₃', state: '(s)', nameMs: 'Iron(III) hydroxide (red-brown ppt)' },
      { coeff: 3, formula: 'NaCl', state: '(aq)', nameMs: 'Sodium chloride' },
    ],
    ionicSplitReactants: 'Fe³⁺(aq) + 3Cl⁻(aq) + 3Na⁺(aq) + 3OH⁻(aq)',
    ionicSplitProducts: 'Fe(OH)₃(s) + 3Na⁺(aq) + 3Cl⁻(aq)',
    spectatorIons: ['3Na⁺(aq)', '3Cl⁻(aq)'],
    netIonicEquation: 'Fe³⁺(aq) + 3OH⁻(aq) → Fe(OH)₃(s)',
    atomAudit: [
      { element: 'Fe', nameMs: 'Iron', leftUnbalanced: 1, rightUnbalanced: 1, balancedCount: 1 },
      { element: 'Cl', nameMs: 'Chlorine', leftUnbalanced: 3, rightUnbalanced: 1, balancedCount: 3 },
      { element: 'Na', nameMs: 'Sodium', leftUnbalanced: 1, rightUnbalanced: 1, balancedCount: 3 },
      { element: 'OH', nameMs: 'Hydroxide compound ion', leftUnbalanced: 1, rightUnbalanced: 3, balancedCount: 3 },
    ],
    steps: [
      {
        step: 1,
        title: 'Apply Compound Ion Brackets in Fe(OH)₃',
        detail: 'Iron(III) has an oxidation state of +3 (Fe³⁺), requiring three OH⁻ ions enclosed in brackets: Fe(OH)₃(s).',
        equationState: 'FeCl₃(aq) + 3NaOH(aq) → Fe(OH)₃(s) + 3NaCl(aq)',
      },
      {
        step: 2,
        title: 'Balance Stoichiometric Coefficients with 3NaOH and 3NaCl',
        detail: 'Placing 3 in front of NaOH and 3 in front of NaCl balances both the 3 Cl⁻ ions and 3 OH⁻ groups.',
        equationState: 'FeCl₃(aq) + 3NaOH(aq) → Fe(OH)₃(s) + 3NaCl(aq)',
      },
      {
        step: 3,
        title: 'Cancel Spectator Ions 3Na⁺(aq) and 3Cl⁻(aq)',
        detail: 'Both Na⁺(aq) and Cl⁻(aq) remain dissolved in aqueous solution.',
        equationState: 'Fe³⁺(aq) + 3OH⁻(aq) → Fe(OH)₃(s)',
      },
      {
        step: 4,
        title: 'Confirm Net Ionic Equation',
        detail: 'One Fe³⁺(aq) cation combines with three OH⁻(aq) anions to form the insoluble red-brown precipitate Fe(OH)₃(s).',
        equationState: 'Fe³⁺(aq) + 3OH⁻(aq) → Fe(OH)₃(s)',
      },
    ],
    realWorldContext: 'Cambridge IGCSE Syllabus 12.4 Identification of Cations: Adding aqueous NaOH or aqueous NH₃ to Fe³⁺(aq) produces a red-brown precipitate insoluble in excess.',
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = IGCSE_QUIZ_QUESTIONS;

/**
 * Helper to compute the revised Student Master Records from chronological attempts.
 * When the same student (matched by case-insensitive trimmed name) completes a quiz,
 * their master record for that chapter is revised with their LATEST score, while preserving
 * their previous score, class, and total attempt count.
 */
/**
 * Builds a unique composite key from student class + student name so students with the
 * same name in different classes (e.g. Alisha in 305 and Alisha in 303) remain distinct.
 */
export function getStudentNormalizedKey(
  studentClass?: string,
  studentName?: string
): string {
  const cleanClass = (studentClass || '305').trim().toLowerCase();
  const cleanName = (studentName || 'Student').trim().toLowerCase();
  return `${cleanClass}::${cleanName}`;
}

export function buildStudentMasterRecords(
  attempts: QuizAttemptRecord[]
): StudentMasterRecord[] {
  const map = new Map<string, StudentMasterRecord>();

  for (const att of attempts) {
    const cleanName = (att.studentName || 'Student').trim();
    const cleanClass = (att.studentClass || '305').trim();
    const key = getStudentNormalizedKey(cleanClass, cleanName);

    let record = map.get(key);
    if (!record) {
      record = {
        normalizedKey: key,
        studentName: cleanName,
        studentClass: cleanClass,
        totalAttempts: 0,
        lastActiveTimestamp: att.timestamp,
        chapters: {},
        overallAverageLatest: 0,
      };
      map.set(key, record);
    }

    // Keep the most recent display casing of the student's name and class
    record.studentName = cleanName;
    if (cleanClass) {
      record.studentClass = cleanClass;
    }
    record.totalAttempts += 1;
    if (att.timestamp >= record.lastActiveTimestamp) {
      record.lastActiveTimestamp = att.timestamp;
    }

    const existingChap = record.chapters[att.chapterId];
    if (!existingChap) {
      record.chapters[att.chapterId] = {
        chapterId: att.chapterId,
        latestScorePercent: att.scorePercent,
        latestCorrectCount: att.correctCount,
        totalQuestions: att.totalQuestions,
        previousScorePercent: null,
        attemptsCount: 1,
        lastUpdatedTimestamp: att.timestamp,
      };
    } else {
      // Revise the student's chapter record with the latest score from the same student name
      existingChap.previousScorePercent = existingChap.latestScorePercent;
      existingChap.latestScorePercent = att.scorePercent;
      existingChap.latestCorrectCount = att.correctCount;
      existingChap.totalQuestions = att.totalQuestions;
      existingChap.attemptsCount += 1;
      existingChap.lastUpdatedTimestamp = att.timestamp;
    }
  }

  // Compute overall average across attempted chapters for each student
  for (const rec of map.values()) {
    const chapValues = Object.values(rec.chapters);
    if (chapValues.length > 0) {
      const sum = chapValues.reduce((acc, c) => acc + c.latestScorePercent, 0);
      rec.overallAverageLatest = Math.round(sum / chapValues.length);
    }
  }

  return Array.from(map.values());
}

/**
 * Resolves the full 10-question script (Questions, Student's Own Answer, Correct Answer,
 * Mark Awarded, and Examiner Comment & Feedback for every wrong question) for any attempt.
 */
export function resolveAttemptQuestionResponses(
  attempt: QuizAttemptRecord
): StudentQuestionResponse[] {
  if (attempt.questionResponses && attempt.questionResponses.length > 0) {
    return attempt.questionResponses;
  }

  const chapterQs = QUIZ_QUESTIONS.filter((q) => q.chapterId === attempt.chapterId);
  return chapterQs.map((q, idx) => {
    const isWrong = attempt.wrongQuestionIds.includes(q.id);
    const isCorrect = !isWrong;
    const correctAnswerText = q.options[q.correctIndex] || q.options[0];
    // Pick a varied distractor index (1, 2, or 3) for wrong answers so each student's wrong option and diagnosis are realistic
    const distractorChoice = ((idx % 3) + 1) % q.options.length || 1;
    const simulatedWrongIndex =
      distractorChoice === q.correctIndex ? 1 : distractorChoice;
    const chosenAnswerText = isCorrect
      ? correctAnswerText
      : q.options[simulatedWrongIndex] || q.options[1];

    const skillMeta = WEAKNESS_SKILLS[q.skillId];
    const specificDistractorDiagnosis =
      !isCorrect && q.wrongDiagnosisMap[simulatedWrongIndex]
        ? q.wrongDiagnosisMap[simulatedWrongIndex]
        : !isCorrect
        ? skillMeta.commonMistakeMs
        : 'Correct! Full 1 mark awarded.';

    const remedialFeedback = !isCorrect
      ? `${q.explanationMs} | Cambridge IGCSE Remedy: ${skillMeta.remedyExplanationMs} (Model Example: ${skillMeta.workedExample})`
      : q.explanationMs;

    return {
      questionId: q.id,
      questionNumber: idx + 1,
      paperRef: q.paperRef,
      contextFormula: q.contextFormula,
      questionText: q.questionMs,
      chosenAnswerText,
      correctAnswerText,
      isCorrect,
      markAwarded: isCorrect ? 1 : 0,
      maxMark: 1,
      skillId: q.skillId,
      skillTitle: skillMeta.titleMs,
      wrongAnswerComment: specificDistractorDiagnosis,
      remedialFeedback,
    };
  });
}

export const PRESET_CLASSES: string[] = [
  '302',
  '303',
  '305',
];

function createSeedAttempt(
  id: string,
  studentName: string,
  studentClass: string,
  chapterId: string,
  dateLabel: string,
  timestamp: string,
  scorePercent: number,
  seedOffset: number
): QuizAttemptRecord {
  const chapterQs = QUIZ_QUESTIONS.filter((q) => q.chapterId === chapterId);
  const totalQuestions = chapterQs.length || 10;
  const correctCount = Math.round((scorePercent / 100) * totalQuestions);
  const wrongCount = Math.max(0, totalQuestions - correctCount);

  // Deterministically select which questions in this chapter the student missed
  const wrongIndices = new Set<number>();
  for (let k = 0; k < wrongCount; k++) {
    const candidateIdx = (seedOffset * 3 + k * 3 + 2) % totalQuestions;
    if (!wrongIndices.has(candidateIdx)) {
      wrongIndices.add(candidateIdx);
    } else {
      for (let probe = 0; probe < totalQuestions; probe++) {
        const alt = (candidateIdx + probe) % totalQuestions;
        if (!wrongIndices.has(alt)) {
          wrongIndices.add(alt);
          break;
        }
      }
    }
  }

  const skillBreakdown: Record<WeaknessSkillId, { correct: number; total: number }> = {
    valensi_kumpulan: { correct: 0, total: 0 },
    logam_peralihan: { correct: 0, total: 0 },
    kurungan_poliatomik: { correct: 0, total: 0 },
    nisbah_ringkas: { correct: 0, total: 0 },
    stoikiometri_atom: { correct: 0, total: 0 },
    simbol_keadaan: { correct: 0, total: 0 },
    ion_pemerhati: { correct: 0, total: 0 },
    persamaan_ionik_bersih: { correct: 0, total: 0 },
  };

  const wrongQuestionIds: string[] = [];

  chapterQs.forEach((q, idx) => {
    const isWrong = wrongIndices.has(idx);
    skillBreakdown[q.skillId].total += 1;
    if (!isWrong) {
      skillBreakdown[q.skillId].correct += 1;
    } else {
      wrongQuestionIds.push(q.id);
    }
  });

  return {
    id,
    studentName,
    studentClass,
    chapterId,
    timestamp,
    dateLabel,
    scorePercent,
    correctCount,
    totalQuestions,
    skillBreakdown,
    wrongQuestionIds,
  };
}

interface ClassStudentSeed {
  name: string;
  // [Attempt 1 score %, Revised Attempt 2 score %] for each of the 4 chapters
  ch1: [number, number];
  ch2: [number, number];
  ch3: [number, number];
  ch4: [number, number];
}

// All 18 students in Class 305 across all 4 chapters:
// - Excellent students (high varied marks 85%–98%): Zalia, Maryam, Mysara, Daniel, Aqil, Alisha
// - Low achiever students (38%–45%): Wafiq, Nadia, Atiah, Aryssa
// - Moderate / good achievers (65%–75%): Adeeb, Adam, Hariz, Aariz, Rifhania, Aleesya, Alyah, Ameena
const CLASS_305_ROSTER: ClassStudentSeed[] = [
  { name: 'Daniel',   ch1: [80, 90],  ch2: [80, 100], ch3: [80, 90],  ch4: [80, 90] },  // Excellent (Avg 93%)
  { name: 'Wafiq',    ch1: [30, 40],  ch2: [40, 50],  ch3: [30, 40],  ch4: [20, 30] },  // Low Achiever (Avg 40%)
  { name: 'Aqil',     ch1: [70, 90],  ch2: [80, 90],  ch3: [70, 80],  ch4: [80, 90] },  // Excellent (Avg 88%)
  { name: 'Adeeb',    ch1: [60, 70],  ch2: [60, 80],  ch3: [60, 70],  ch4: [60, 70] },  // Good (Avg 73%)
  { name: 'Adam',     ch1: [60, 80],  ch2: [60, 70],  ch3: [50, 60],  ch4: [60, 70] },  // Good (Avg 70%)
  { name: 'Hariz',    ch1: [50, 70],  ch2: [50, 60],  ch3: [60, 70],  ch4: [50, 60] },  // Moderate (Avg 65%)
  { name: 'Aariz',    ch1: [50, 60],  ch2: [60, 70],  ch3: [60, 70],  ch4: [70, 80] },  // Good (Avg 70%)
  { name: 'Rifhania', ch1: [70, 80],  ch2: [60, 70],  ch3: [70, 80],  ch4: [60, 70] },  // Good (Avg 75%)
  { name: 'Aleesya',  ch1: [60, 70],  ch2: [70, 80],  ch3: [60, 70],  ch4: [70, 80] },  // Good (Avg 75%)
  { name: 'Alyah',    ch1: [50, 60],  ch2: [60, 70],  ch3: [50, 60],  ch4: [60, 70] },  // Moderate (Avg 65%)
  { name: 'Aryssa',   ch1: [30, 40],  ch2: [20, 30],  ch3: [40, 50],  ch4: [20, 30] },  // Low Achiever (Avg 38%)
  { name: 'Maryam',   ch1: [90, 100], ch2: [80, 90],  ch3: [90, 100], ch4: [80, 90] },  // Excellent (Avg 95%)
  { name: 'Mysara',   ch1: [80, 90],  ch2: [70, 90],  ch3: [90, 100], ch4: [70, 80] },  // Excellent (Avg 90%)
  { name: 'Nadia',    ch1: [30, 40],  ch2: [30, 50],  ch3: [30, 40],  ch4: [30, 40] },  // Low Achiever (Avg 43%)
  { name: 'Alisha',   ch1: [70, 80],  ch2: [80, 90],  ch3: [80, 90],  ch4: [70, 80] },  // Excellent (Avg 85%)
  { name: 'Ameena',   ch1: [60, 80],  ch2: [60, 70],  ch3: [60, 70],  ch4: [50, 60] },  // Good (Avg 70%)
  { name: 'Atiah',    ch1: [40, 50],  ch2: [30, 40],  ch3: [40, 50],  ch4: [30, 40] },  // Low Achiever (Avg 45%)
  { name: 'Zalia',    ch1: [90, 100], ch2: [90, 100], ch3: [80, 90],  ch4: [90, 100] }, // Excellent (Avg 98%)
];

// All 20 students in Class 302 across all 4 chapters (marks scaled lower than Class 305):
// - Excellent students (varied higher marks 75%–88%, lower than 305's 85%–98%): Khaliq, Dhea, Auni, Az-Zahra, Syafiq, Raiyan
// - Low achiever students (23%–35%, lower than 305's 38%–45%): Farhan, Maheera, Adelia, Hasya, Syed, Arsy
// - Moderate achievers (53%–65%, lower than 305's 65%–75%): Hadi, Hadif, Akhtar, Damia, Tengku, Hana, Wafa, Sofea
const CLASS_302_ROSTER: ClassStudentSeed[] = [
  { name: 'Syed',     ch1: [20, 30],  ch2: [10, 20],  ch3: [20, 30],  ch4: [10, 20] },  // Low Achiever (Avg 25%)
  { name: 'Khaliq',   ch1: [70, 90],  ch2: [80, 90],  ch3: [70, 80],  ch4: [80, 90] },  // Excellent (Avg 88%)
  { name: 'Hadi',     ch1: [50, 60],  ch2: [50, 70],  ch3: [50, 60],  ch4: [50, 60] },  // Moderate (Avg 63%)
  { name: 'Raiyan',   ch1: [60, 70],  ch2: [70, 80],  ch3: [60, 80],  ch4: [60, 70] },  // Excellent (Avg 75%)
  { name: 'Farhan',   ch1: [20, 30],  ch2: [20, 40],  ch3: [20, 30],  ch4: [10, 20] },  // Low Achiever (Avg 30%)
  { name: 'Hadif',    ch1: [40, 60],  ch2: [50, 60],  ch3: [40, 50],  ch4: [50, 60] },  // Moderate (Avg 58%)
  { name: 'Syafiq',   ch1: [60, 80],  ch2: [70, 80],  ch3: [60, 70],  ch4: [70, 80] },  // Excellent (Avg 78%)
  { name: 'Akhtar',   ch1: [40, 50],  ch2: [50, 60],  ch3: [50, 60],  ch4: [40, 50] },  // Moderate (Avg 55%)
  { name: 'Arsy',     ch1: [10, 20],  ch2: [20, 30],  ch3: [10, 20],  ch4: [10, 20] },  // Low Achiever (Avg 23%)
  { name: 'Maheera',  ch1: [20, 40],  ch2: [20, 30],  ch3: [30, 40],  ch4: [20, 30] },  // Low Achiever (Avg 35%)
  { name: 'Auni',     ch1: [70, 90],  ch2: [70, 80],  ch3: [70, 80],  ch4: [70, 80] },  // Excellent (Avg 83%)
  { name: 'Dhea',     ch1: [70, 80],  ch2: [80, 90],  ch3: [70, 90],  ch4: [70, 80] },  // Excellent (Avg 85%)
  { name: 'Hasya',    ch1: [10, 30],  ch2: [20, 30],  ch3: [20, 30],  ch4: [10, 20] },  // Low Achiever (Avg 28%)
  { name: 'Adelia',   ch1: [20, 30],  ch2: [10, 30],  ch3: [20, 30],  ch4: [20, 40] },  // Low Achiever (Avg 33%)
  { name: 'Damia',    ch1: [50, 70],  ch2: [50, 60],  ch3: [50, 60],  ch4: [50, 70] },  // Moderate (Avg 65%)
  { name: 'Tengku',   ch1: [40, 50],  ch2: [40, 60],  ch3: [40, 50],  ch4: [40, 50] },  // Moderate (Avg 53%)
  { name: 'Hana',     ch1: [50, 60],  ch2: [50, 60],  ch3: [50, 70],  ch4: [40, 50] },  // Moderate (Avg 60%)
  { name: 'Az-Zahra', ch1: [60, 80],  ch2: [70, 80],  ch3: [70, 90],  ch4: [60, 70] },  // Excellent (Avg 80%)
  { name: 'Wafa',     ch1: [40, 60],  ch2: [50, 60],  ch3: [50, 60],  ch4: [40, 50] },  // Moderate (Avg 58%)
  { name: 'Sofea',    ch1: [50, 60],  ch2: [50, 70],  ch3: [40, 60],  ch4: [50, 60] },  // Moderate (Avg 63%)
];

// All 19 students in Class 303 across all 4 chapters (marks scaled higher than both 302 and 305):
// - Excellent students (varied higher marks 90%–100%, higher than 305's 85%–98% & 302's 75%–88%):
//   Zyan, Haikasyah, Wafiy, Asif, Dhia, Alisha, Carrisa, Kamelia, Jasmin
// - Low achiever students (48%–58%, higher than 305's 38%–45% & 302's 23%–35%):
//   Hannah, Hani, Syaddad, Carlief, Batrisyia, Aisya, Nufah
// - Moderate achievers (78%–83%, higher than 305's 65%–75% & 302's 53%–65%):
//   Qasha, Qaeim, Zara
const CLASS_303_ROSTER: ClassStudentSeed[] = [
  { name: 'Haikasyah', ch1: [90, 100], ch2: [90, 100], ch3: [90, 100], ch4: [80, 90] },  // Excellent (Avg 98%)
  { name: 'Zyan',      ch1: [90, 100], ch2: [90, 100], ch3: [90, 100], ch4: [90, 100] }, // Excellent (Avg 100%)
  { name: 'Carlief',   ch1: [40, 50],  ch2: [40, 50],  ch3: [40, 50],  ch4: [40, 50] },  // Low Achiever (Avg 50%)
  { name: 'Qasha',     ch1: [70, 80],  ch2: [70, 90],  ch3: [70, 80],  ch4: [70, 80] },  // Moderate (Avg 83%)
  { name: 'Qaeim',     ch1: [70, 80],  ch2: [70, 80],  ch3: [70, 80],  ch4: [70, 80] },  // Moderate (Avg 80%)
  { name: 'Syaddad',   ch1: [30, 50],  ch2: [40, 50],  ch3: [30, 50],  ch4: [30, 40] },  // Low Achiever (Avg 48%)
  { name: 'Asif',      ch1: [80, 100], ch2: [80, 90],  ch3: [90, 100], ch4: [80, 90] },  // Excellent (Avg 95%)
  { name: 'Wafiy',     ch1: [90, 100], ch2: [80, 100], ch3: [80, 90],  ch4: [90, 100] }, // Excellent (Avg 98%)
  { name: 'Alisha',    ch1: [80, 90],  ch2: [80, 100], ch3: [80, 90],  ch4: [80, 90] },  // Excellent (Avg 93%)
  { name: 'Carrisa',   ch1: [80, 90],  ch2: [80, 90],  ch3: [80, 100], ch4: [80, 90] },  // Excellent (Avg 93%)
  { name: 'Hannah',    ch1: [40, 50],  ch2: [40, 60],  ch3: [40, 50],  ch4: [40, 50] },  // Low Achiever (Avg 53%)
  { name: 'Dhia',      ch1: [80, 90],  ch2: [90, 100], ch3: [80, 100], ch4: [80, 90] },  // Excellent (Avg 95%)
  { name: 'Aisya',     ch1: [40, 60],  ch2: [50, 60],  ch3: [40, 50],  ch4: [50, 60] },  // Low Achiever (Avg 58%)
  { name: 'Batrisyia', ch1: [40, 50],  ch2: [50, 60],  ch3: [40, 50],  ch4: [40, 50] },  // Low Achiever (Avg 53%)
  { name: 'Jasmin',    ch1: [80, 90],  ch2: [80, 90],  ch3: [80, 90],  ch4: [80, 90] },  // Excellent (Avg 90%)
  { name: 'Hani',      ch1: [40, 60],  ch2: [40, 50],  ch3: [40, 60],  ch4: [40, 50] },  // Low Achiever (Avg 55%)
  { name: 'Kamelia',   ch1: [80, 100], ch2: [80, 90],  ch3: [80, 90],  ch4: [70, 80] },  // Excellent (Avg 90%)
  { name: 'Nufah',     ch1: [30, 50],  ch2: [30, 40],  ch3: [40, 50],  ch4: [40, 50] },  // Low Achiever (Avg 48%)
  { name: 'Zara',      ch1: [60, 80],  ch2: [70, 80],  ch3: [60, 70],  ch4: [70, 80] },  // Moderate (Avg 78%)
];

function buildClassSeedHistory(
  roster: ClassStudentSeed[],
  classLabel: string,
  seedBase: number
): QuizAttemptRecord[] {
  return roster.flatMap((stu, sIdx) => {
    const chaptersData: { cid: string; scores: [number, number]; day1: string; day2: string }[] = [
      { cid: 'bab1', scores: stu.ch1, day1: '2026-10-01T09:15:00Z', day2: '2026-10-02T14:20:00Z' },
      { cid: 'bab2', scores: stu.ch2, day1: '2026-10-02T10:30:00Z', day2: '2026-10-03T15:10:00Z' },
      { cid: 'bab3', scores: stu.ch3, day1: '2026-10-03T11:00:00Z', day2: '2026-10-04T16:05:00Z' },
      { cid: 'bab4', scores: stu.ch4, day1: '2026-10-04T13:45:00Z', day2: '2026-10-05T08:00:00Z' },
    ];

    return chaptersData.flatMap((ch, cIdx) => [
      createSeedAttempt(
        `${classLabel}-${sIdx + 1}-${ch.cid}-att1`,
        stu.name,
        classLabel,
        ch.cid,
        'Attempt 1',
        ch.day1,
        ch.scores[0],
        seedBase + sIdx + cIdx + 1
      ),
      createSeedAttempt(
        `${classLabel}-${sIdx + 1}-${ch.cid}-att2`,
        stu.name,
        classLabel,
        ch.cid,
        'Attempt 2',
        ch.day2,
        ch.scores[1],
        seedBase + sIdx + cIdx + 3
      ),
    ]);
  });
}

export const INITIAL_QUIZ_HISTORY: QuizAttemptRecord[] = [
  ...buildClassSeedHistory(CLASS_305_ROSTER, '305', 0),
  ...buildClassSeedHistory(CLASS_303_ROSTER, '303', 25),
  ...buildClassSeedHistory(CLASS_302_ROSTER, '302', 50),
];


