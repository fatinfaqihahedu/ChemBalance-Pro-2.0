import { QuizQuestion } from './chemistryData';

export const IGCSE_QUIZ_QUESTIONS: QuizQuestion[] = [
  // ============================================================================
  // CHAPTER 1: Atomic Structure, Electronic Configuration & Ionic Charges (10 Qs)
  // ============================================================================
  {
    id: 'c1-q1',
    chapterId: 'bab1',
    skillId: 'valensi_kumpulan',
    paperRef: 'Paper 2 (Extended MCQ) · Syllabus 2.4 Ion Formation',
    questionMs:
      'An element X has the electronic configuration 2,8,3. Which statement describes the formation of an ion of X with a noble gas electronic configuration?',
    contextFormula: 'Electronic configuration of atom X: 2,8,3',
    options: [
      'Each atom of X loses 3 valence electrons to form an X³⁺ cation with configuration 2,8',
      'Each atom of X gains 5 electrons to form an X³⁻ anion with configuration 2,8,8',
      'Each atom of X loses 1 valence electron to form an X⁺ cation with configuration 2,8,2',
      'Each atom of X shares 3 electrons to form a covalent molecule X₂',
    ],
    correctIndex: 0,
    explanationMs:
      'According to the Cambridge IGCSE Chemistry syllabus, Group III (13) metallic elements such as Aluminium (2,8,3) lose their 3 valence electrons to achieve the stable noble gas electronic configuration of Neon (2,8), forming a triply charged positive cation, X³⁺.',
    wrongDiagnosisMap: {
      1: 'Metallic atoms in Group III lose electrons rather than gaining 5 electrons; losing 3 electrons requires far less energy.',
      2: 'Losing only 1 electron leaves an incomplete outer shell (2,8,2) instead of a noble gas configuration.',
      3: 'Metals react with non-metals by electron transfer (ionic bonding), not covalent sharing.',
    },
  },
  {
    id: 'c1-q2',
    chapterId: 'bab1',
    skillId: 'valensi_kumpulan',
    paperRef: 'Paper 2 (Extended MCQ) · Syllabus 2.2 Electronic Configuration',
    questionMs:
      'Which row in the table correctly identifies the number of protons, neutrons, and electrons in a nitride ion, ¹⁴₇N³⁻?',
    contextFormula: 'Nuclide notation: ¹⁴₇N³⁻ (Proton number Z = 7, Nucleon number A = 14)',
    options: [
      '7 protons, 7 neutrons, 10 electrons',
      '7 protons, 7 neutrons, 4 electrons',
      '10 protons, 7 neutrons, 7 electrons',
      '7 protons, 14 neutrons, 10 electrons',
    ],
    correctIndex: 0,
    explanationMs:
      'The atomic (proton) number is 7, so there are 7 protons. The number of neutrons = nucleon number (14) − proton number (7) = 7. A neutral nitrogen atom has 7 electrons; gaining 3 electrons to form the N³⁻ anion gives 7 + 3 = 10 electrons (2,8).',
    wrongDiagnosisMap: {
      1: 'A 3− charge means the atom has GAINED 3 negatively charged electrons (7 + 3 = 10), not lost 3 electrons.',
      2: 'Ion formation never changes the number of protons in the nucleus; proton number remains 7.',
      3: '14 is the nucleon (mass) number (protons + neutrons). Neutrons = 14 − 7 = 7.',
    },
  },
  {
    id: 'c1-q3',
    chapterId: 'bab1',
    skillId: 'logam_peralihan',
    paperRef: 'Paper 4 (Extended Theory) · Syllabus 8.3 Transition Elements',
    questionMs:
      'Iron is a transition element that forms two common chlorides: iron(II) chloride and iron(III) chloride. What does the Roman numeral (III) in iron(III) chloride state?',
    contextFormula: 'Transition element nomenclature: Iron(III) chloride',
    options: [
      'The oxidation state of the iron ion is +3 (Fe³⁺)',
      'There are three iron cations in each formula unit (Fe₃Cl)',
      'Iron is located in Period 3 of the Periodic Table',
      'Each iron atom shares three pairs of electrons with chlorine',
    ],
    correctIndex: 0,
    explanationMs:
      'In IUPAC and Cambridge IGCSE nomenclature, Roman numerals in parentheses immediately following the name of a transition element specify its oxidation number (ionic charge). Iron(III) denotes the Fe³⁺ cation.',
    wrongDiagnosisMap: {
      1: 'The Roman numeral (III) refers to the +3 charge on a single Fe³⁺ cation, meaning it bonds with three Cl⁻ ions to form FeCl₃, not Fe₃Cl.',
      2: 'Iron is in Period 4; Roman numerals indicate oxidation state, not period number.',
      3: 'Iron(III) chloride is an ionic compound formed by electron transfer, not covalent sharing.',
    },
  },
  {
    id: 'c1-q4',
    chapterId: 'bab1',
    skillId: 'valensi_kumpulan',
    paperRef: 'Paper 2 (Extended MCQ) · Syllabus 2.4 Isoelectronic Ions',
    questionMs:
      'Which group of particles are isoelectronic (all possess the exact same electronic configuration of 2,8)?',
    contextFormula: 'Atomic numbers: N=7, O=8, F=9, Ne=10, Na=11, Mg=12, Al=13',
    options: [
      'N³⁻, O²⁻, F⁻, Na⁺, Mg²⁺, Al³⁺',
      'N³⁻, O²⁻, Cl⁻, K⁺, Ca²⁺',
      'Li⁺, Be²⁺, Na⁺, Mg²⁺',
      'O²⁻, S²⁻, F⁻, Cl⁻',
    ],
    correctIndex: 0,
    explanationMs:
      'N³⁻ (7+3=10e⁻), O²⁻ (8+2=10e⁻), F⁻ (9+1=10e⁻), Na⁺ (11−1=10e⁻), Mg²⁺ (12−2=10e⁻), and Al³⁺ (13−3=10e⁻) all contain exactly 10 electrons arranged as 2,8 (matching Neon).',
    wrongDiagnosisMap: {
      1: 'Cl⁻, K⁺, and Ca²⁺ have 18 electrons (2,8,8), whereas O²⁻ has 10 electrons (2,8).',
      2: 'Li⁺ and Be²⁺ have 2 electrons (helium configuration), whereas Na⁺ and Mg²⁺ have 10 electrons.',
      3: 'Ions in the same group have the same valence charge but different total numbers of occupied electron shells.',
    },
  },
  {
    id: 'c1-q5',
    chapterId: 'bab1',
    skillId: 'valensi_kumpulan',
    paperRef: 'Paper 4 (Extended Theory) · Syllabus 2.4 Giant Ionic Lattice',
    questionMs:
      'Which statement accurately defines an ionic bond according to the Cambridge IGCSE Chemistry specification?',
    contextFormula: 'Formation of Giant Ionic Lattice',
    options: [
      'A strong electrostatic attraction between oppositely charged ions',
      'A strong electrostatic attraction between a shared pair of electrons and two nuclei',
      'A weak intermolecular force of attraction between neighbouring molecules',
      'An electrostatic attraction between positive metal ions and a sea of delocalised electrons',
    ],
    correctIndex: 0,
    explanationMs:
      'The Cambridge IGCSE mark scheme definition of an ionic bond is: "a strong electrostatic attraction between oppositely charged ions (cations and anions)" arranged in a regular giant ionic lattice.',
    wrongDiagnosisMap: {
      1: 'Attraction between a shared pair of electrons and two nuclei defines a covalent bond.',
      2: 'Ionic bonds are strong electrostatic forces within a giant lattice, not weak intermolecular forces.',
      3: 'Positive ions in a sea of delocalised electrons defines metallic bonding.',
    },
  },
  {
    id: 'c1-q6',
    chapterId: 'bab1',
    skillId: 'logam_peralihan',
    paperRef: 'Paper 2 (Extended MCQ) · Syllabus 8.3 Transition Elements',
    questionMs:
      'Two metallic elements, Zinc and Silver, are located in the transition block of the Periodic Table but form ions with a single fixed oxidation state. What are the formulas of their ions?',
    contextFormula: 'Fixed-charge ions in IGCSE Chemistry',
    options: [
      'Zn²⁺ and Ag⁺',
      'Zn⁺ and Ag²⁺',
      'Zn³⁺ and Ag⁺',
      'Zn²⁺ and Ag²⁺',
    ],
    correctIndex: 0,
    explanationMs:
      'In the Cambridge IGCSE syllabus, students must recall that Zinc always forms Zn²⁺ (+2) and Silver always forms Ag⁺ (+1) without Roman numerals in their compound names (e.g. zinc chloride, silver nitrate).',
    wrongDiagnosisMap: {
      1: 'You swapped the charges: Zinc is always +2 (Zn²⁺) and Silver is always +1 (Ag⁺).',
      2: 'Zinc never forms a +3 ion; its stable ion is Zn²⁺.',
      3: 'Silver forms Ag⁺ (+1) in all standard IGCSE compounds such as AgNO₃ and AgCl.',
    },
  },
  {
    id: 'c1-q7',
    chapterId: 'bab1',
    skillId: 'valensi_kumpulan',
    paperRef: 'Paper 2 (Extended MCQ) · Syllabus 8.1 The Periodic Table',
    questionMs:
      'Element Y is in Group VI (Group 16) of the Periodic Table. How does an atom of element Y react when it forms an ionic compound with Potassium (Group I)?',
    contextFormula: 'Group I (K) + Group VI (Y)',
    options: [
      'Each atom of Y gains 2 electrons from two Potassium atoms to form a Y²⁻ ion',
      'Each atom of Y loses 6 electrons to form a Y⁶⁺ ion',
      'Each atom of Y gains 6 electrons to form a Y⁶⁻ ion',
      'Each atom of Y loses 2 electrons to form a Y²⁺ ion',
    ],
    correctIndex: 0,
    explanationMs:
      'Group VI (16) non-metals have 6 valence electrons. To complete their octet of 8 valence electrons, each atom gains 2 electrons (8 − 6 = 2) from two K atoms, forming a Y²⁻ anion.',
    wrongDiagnosisMap: {
      1: 'Non-metals in Group VI gain electrons to fill their outer shell rather than losing 6 electrons.',
      2: '6 is the number of valence electrons already present; it only needs 2 more electrons to reach 8.',
      3: 'Non-metals gain negatively charged electrons to form anions (Y²⁻), not cations.',
    },
  },
  {
    id: 'c1-q8',
    chapterId: 'bab1',
    skillId: 'logam_peralihan',
    paperRef: 'Paper 4 (Extended Theory) · Syllabus 3.1 Deduce Oxidation State',
    questionMs:
      'What is the charge on the copper ion in the compound copper(I) oxide, Cu₂O?',
    contextFormula: 'Formula: Cu₂O (where oxide ion is O²⁻)',
    options: [
      '+1 (Cu⁺)',
      '+2 (Cu²⁺)',
      '−1 (Cu⁻)',
      '+4 (Cu⁴⁺)',
    ],
    correctIndex: 0,
    explanationMs:
      'In Cu₂O, the single oxide ion carries a −2 charge (O²⁻). Since the compound has zero net charge, the two copper ions together must supply +2, so each copper(I) ion has a charge of +1 (Cu⁺), matching the Roman numeral (I).',
    wrongDiagnosisMap: {
      1: 'Cu²⁺ is copper(II), which forms CuO. In Cu₂O (copper(I) oxide), each copper ion is Cu⁺ (+1).',
      2: 'Metals always form positively charged cations, never negative anions.',
      3: 'Two Cu⁺ ions balance one O²⁻ ion: 2(+1) + (−2) = 0.',
    },
  },
  {
    id: 'c1-q9',
    chapterId: 'bab1',
    skillId: 'valensi_kumpulan',
    paperRef: 'Paper 2 (Extended MCQ) · Syllabus 2.4 Ion Dot-and-Cross',
    questionMs:
      'Calcium (proton number 20) reacts with Fluorine (proton number 9) to form calcium fluoride. Which electronic configurations are correct for the ions in calcium fluoride?',
    contextFormula: 'Ca (Z = 20) + F (Z = 9) → CaF₂',
    options: [
      'Ca²⁺ is 2,8,8 and F⁻ is 2,8',
      'Ca²⁺ is 2,8,8,2 and F⁻ is 2,7',
      'Ca⁺ is 2,8,8,1 and F⁻ is 2,8',
      'Ca²⁺ is 2,8 and F⁻ is 2,8,8',
    ],
    correctIndex: 0,
    explanationMs:
      'A neutral Calcium atom is 2,8,8,2 and loses 2 valence electrons to form Ca²⁺ (2,8,8). Each Fluorine atom is 2,7 and gains 1 valence electron to form F⁻ (2,8).',
    wrongDiagnosisMap: {
      1: '2,8,8,2 and 2,7 are the electronic configurations of the neutral uncombined atoms, not the ions.',
      2: 'Calcium is in Group II and loses both valence electrons to form Ca²⁺, not Ca⁺.',
      3: 'Ca²⁺ has 18 electrons (2,8,8) while F⁻ has 10 electrons (2,8).',
    },
  },
  {
    id: 'c1-q10',
    chapterId: 'bab1',
    skillId: 'logam_peralihan',
    paperRef: 'Paper 4 (Extended Theory) · Syllabus 3.1 Oxidation Numbers',
    questionMs:
      'Chromium(III) sulfate is an ionic compound containing Cr³⁺ cations and SO₄²⁻ anions. What is the total positive charge contributed by the chromium ions in one formula unit of Cr₂(SO₄)₃?',
    contextFormula: 'Formula unit: Cr₂(SO₄)₃',
    options: [
      '+6',
      '+3',
      '+2',
      '+12',
    ],
    correctIndex: 0,
    explanationMs:
      'Each Cr³⁺ ion carries a +3 charge. Since there are 2 chromium ions in Cr₂(SO₄)₃, the total positive charge is 2 × (+3) = +6, which exactly balances the 3 × (−2) = −6 charge of the three sulfate ions.',
    wrongDiagnosisMap: {
      1: '+3 is the charge on a single Cr³⁺ ion, but there are 2 Cr³⁺ ions in the formula unit.',
      2: '2 is the subscript (number of Cr³⁺ ions), not the electrical charge.',
      3: 'Multiply the 2 chromium ions by +3 charge = +6 (not +12).',
    },
  },

  // ============================================================================
  // CHAPTER 2: Formulae of Ionic Compounds & Compound Ions (10 Qs)
  // ============================================================================
  {
    id: 'c2-q1',
    chapterId: 'bab2',
    skillId: 'kurungan_poliatomik',
    paperRef: 'Paper 2 (Extended MCQ) · Syllabus 3.1 Formulae of Ionic Compounds',
    questionMs:
      'What is the correct chemical formula for calcium hydroxide, commonly known as slaked lime?',
    contextFormula: 'Ions present: Ca²⁺ and OH⁻',
    options: [
      'Ca(OH)₂',
      'CaOH₂',
      'Ca₂OH',
      '(Ca)₂OH',
    ],
    correctIndex: 0,
    explanationMs:
      'The calcium cation is Ca²⁺ (+2) and the compound hydroxide ion is OH⁻ (−1). Two entire OH⁻ ions are required to balance one Ca²⁺ ion, so brackets must enclose the OH group: Ca(OH)₂.',
    wrongDiagnosisMap: {
      1: 'Omitting brackets in CaOH₂ indicates only 1 oxygen atom and 2 hydrogen atoms. Brackets are mandatory around multiplied compound ions!',
      2: 'You inverted the ionic ratio: one Ca²⁺ (+2) requires two OH⁻ (−1) ions.',
      3: 'Monoatomic cations like Ca²⁺ are never enclosed in brackets.',
    },
  },
  {
    id: 'c2-q2',
    chapterId: 'bab2',
    skillId: 'nisbah_ringkas',
    paperRef: 'Paper 2 (Extended MCQ) · Syllabus 3.1 Empirical Formulae',
    questionMs:
      'Magnesium ribbon burns brightly in oxygen to form white magnesium oxide powder. What is the empirical formula of magnesium oxide?',
    contextFormula: 'Ions present: Mg²⁺ and O²⁻',
    options: [
      'MgO',
      'Mg₂O₂',
      'MgO₂',
      'Mg₂O',
    ],
    correctIndex: 0,
    explanationMs:
      'Magnesium forms Mg²⁺ (+2) and oxygen forms O²⁻ (−2). Crossing the charges gives a 2:2 ratio, which must be simplified to the lowest whole-number empirical ratio of 1:1, written as MgO.',
    wrongDiagnosisMap: {
      1: 'Mg₂O₂ is not in its simplest whole-number ratio! Divide both subscripts by 2 to get MgO.',
      2: 'One O²⁻ ion (−2) already balances one Mg²⁺ ion (+2); MgO₂ would have an unbalanced charge.',
      3: 'The ratio of Mg²⁺ to O²⁻ is 1:1, not 2:1.',
    },
  },
  {
    id: 'c2-q3',
    chapterId: 'bab2',
    skillId: 'kurungan_poliatomik',
    paperRef: 'Paper 4 (Extended Theory) · Syllabus 3.1 Compound Ions',
    questionMs:
      'Deduce the chemical formula of aluminium sulfate, formed from aluminium ions (Al³⁺) and sulfate ions (SO₄²⁻).',
    contextFormula: 'Ions present: Al³⁺ and SO₄²⁻',
    options: [
      'Al₂(SO₄)₃',
      'Al₃(SO₄)₂',
      'Al₂SO₄₃',
      'Al(SO₄)₃',
    ],
    correctIndex: 0,
    explanationMs:
      'The lowest common multiple of +3 and −2 is 6. Two Al³⁺ cations give 2 × (+3) = +6, and three SO₄²⁻ anions give 3 × (−2) = −6. Enclosing the compound sulfate ion in brackets gives Al₂(SO₄)₃.',
    wrongDiagnosisMap: {
      1: 'You did not swap the charge magnitudes: 3 Al³⁺ (+9) and 2 SO₄²⁻ (−4) do not balance to zero.',
      2: 'Without brackets around SO₄, writing SO₄₃ reads as 43 oxygen atoms!',
      3: 'One Al³⁺ (+3) cannot balance three SO₄²⁻ ions (−6).',
    },
  },
  {
    id: 'c2-q4',
    chapterId: 'bab2',
    skillId: 'kurungan_poliatomik',
    paperRef: 'Paper 2 (Extended MCQ) · Syllabus 3.1 Ammonium Salts',
    questionMs:
      'Ammonium carbonate is used in smelling salts. Given that the ammonium ion is NH₄⁺ and the carbonate ion is CO₃²⁻, what is the formula of ammonium carbonate?',
    contextFormula: 'Ions present: NH₄⁺ and CO₃²⁻',
    options: [
      '(NH₄)₂CO₃',
      'NH₄(CO₃)₂',
      'NH₈CO₃',
      'NH₄₂CO₃',
    ],
    correctIndex: 0,
    explanationMs:
      'Because the carbonate anion carries a −2 charge (CO₃²⁻) and the polyatomic ammonium cation carries a +1 charge (NH₄⁺), two NH₄⁺ ions are needed. Since NH₄⁺ is a compound ion with subscript 2, brackets are required: (NH₄)₂CO₃.',
    wrongDiagnosisMap: {
      1: 'Only one CO₃²⁻ (−2) group is needed to balance two NH₄⁺ (+1) ions.',
      2: 'Never multiply the internal subscripts of a compound ion; wrap NH₄ in brackets as (NH₄)₂.',
      3: 'Omitting brackets in NH₄₂CO₃ makes the hydrogen subscript read as 42!',
    },
  },
  {
    id: 'c2-q5',
    chapterId: 'bab2',
    skillId: 'kurungan_poliatomik',
    paperRef: 'Paper 4 (Extended Theory) · Syllabus 3.1 Phosphate Salts',
    questionMs:
      'Calcium phosphate is the main mineral component of tooth enamel. What is the correct formula for calcium phosphate, given Ca²⁺ and PO₄³⁻?',
    contextFormula: 'Ions present: Ca²⁺ and PO₄³⁻',
    options: [
      'Ca₃(PO₄)₂',
      'Ca₂(PO₄)₃',
      'CaPO₄',
      'Ca₃PO₄₂',
    ],
    correctIndex: 0,
    explanationMs:
      'Crossing the charge magnitudes (+2 from Ca²⁺ and −3 from PO₄³⁻) gives 3 Ca²⁺ ions (3 × +2 = +6) and 2 PO₄³⁻ ions (2 × −3 = −6). Wrapping the phosphate group in brackets gives Ca₃(PO₄)₂.',
    wrongDiagnosisMap: {
      1: '2 Ca²⁺ (+4) and 3 PO₄³⁻ (−9) do not balance to zero net charge.',
      2: 'Ca²⁺ (+2) and PO₄³⁻ (−3) do not have equal charges, so a 1:1 ratio is unbalanced.',
      3: 'Brackets must be placed around the compound ion PO₄ when multiplied by 2: Ca₃(PO₄)₂.',
    },
  },
  {
    id: 'c2-q6',
    chapterId: 'bab2',
    skillId: 'nisbah_ringkas',
    paperRef: 'Paper 2 (Extended MCQ) · Syllabus 3.1 Deduce Anion Charge',
    questionMs:
      'A metallic element M forms an oxide with the formula M₂O₃. What is the formula of the nitrate of element M?',
    contextFormula: 'Given oxide: M₂O₃ (where O is O²⁻ and nitrate is NO₃⁻)',
    options: [
      'M(NO₃)₃',
      'M₂(NO₃)₃',
      'MNO₃',
      'M₃NO₃',
    ],
    correctIndex: 0,
    explanationMs:
      'From M₂O₃, three O²⁻ ions have a total charge of −6, so the two M ions must each have a charge of +3 (M³⁺). Combining M³⁺ with the nitrate ion NO₃⁻ (−1) requires three nitrate groups: M(NO₃)₃.',
    wrongDiagnosisMap: {
      1: 'Since NO₃⁻ has a charge of −1 (not −2), only one M³⁺ ion is needed to balance three NO₃⁻ ions.',
      2: 'MNO₃ would only be correct if M had a +1 charge, but M₂O₃ proves M is M³⁺.',
      3: 'One M³⁺ ion requires three NO₃⁻ ions, not three M ions.',
    },
  },
  {
    id: 'c2-q7',
    chapterId: 'bab2',
    skillId: 'nisbah_ringkas',
    paperRef: 'Paper 2 (Extended MCQ) · Syllabus 3.1 Sulfide vs Sulfate',
    questionMs:
      'Which row shows the correct chemical formulas for both sodium sulfide and sodium sulfate?',
    contextFormula: 'Sulfide ion = S²⁻ · Sulfate ion = SO₄²⁻ · Sodium ion = Na⁺',
    options: [
      'Sodium sulfide: Na₂S · Sodium sulfate: Na₂SO₄',
      'Sodium sulfide: NaS · Sodium sulfate: NaSO₄',
      'Sodium sulfide: Na₂SO₃ · Sodium sulfate: Na₂SO₄',
      'Sodium sulfide: Na₂S · Sodium sulfate: Na(SO₄)₂',
    ],
    correctIndex: 0,
    explanationMs:
      'The "-ide" ending indicates a monoatomic non-metal ion (sulfide = S²⁻), while "-ate" indicates a compound oxyanion (sulfate = SO₄²⁻). Since both carry a −2 charge and sodium is Na⁺ (+1), their formulas are Na₂S and Na₂SO₄.',
    wrongDiagnosisMap: {
      1: 'Both S²⁻ and SO₄²⁻ carry a −2 charge, so each requires two Na⁺ ions (Na₂S and Na₂SO₄).',
      2: 'Na₂SO₃ is sodium sulfite (containing SO₃²⁻), whereas sodium sulfide contains only sulfur (S²⁻).',
      3: 'Only one SO₄²⁻ group is present in Na₂SO₄, so no brackets are used.',
    },
  },
  {
    id: 'c2-q8',
    chapterId: 'bab2',
    skillId: 'kurungan_poliatomik',
    paperRef: 'Paper 4 (Extended Theory) · Syllabus 3.1 Complex Ionic Minerals',
    questionMs:
      'Cryolite, Na₃AlF₆, is added to alumina in the industrial extraction of aluminium. Show that the charges of the ions in Na₃AlF₆ balance to zero.',
    contextFormula: 'Ions in Na₃AlF₆: Na⁺, Al³⁺, and F⁻',
    options: [
      '3(+1) + 1(+3) + 6(−1) = +6 − 6 = 0',
      '3(+1) + 3(+1) + 6(−2) = 0',
      '1(+3) + 1(+3) + 6(−1) = 0',
      '3(+2) + 1(+3) + 6(−1.5) = 0',
    ],
    correctIndex: 0,
    explanationMs:
      'Three Na⁺ ions contribute 3 × (+1) = +3. One Al³⁺ ion contributes +3. Total positive charge = +6. Six F⁻ ions contribute 6 × (−1) = −6. Net charge = +6 − 6 = 0.',
    wrongDiagnosisMap: {
      1: 'Fluoride is in Group VII (17) and carries a −1 charge (F⁻), not −2.',
      2: 'Sodium is in Group I and carries a +1 charge (Na⁺), not +3.',
      3: 'Ions always carry whole-number charges (+1 for Na⁺, +3 for Al³⁺, −1 for F⁻).',
    },
  },
  {
    id: 'c2-q9',
    chapterId: 'bab2',
    skillId: 'nisbah_ringkas',
    paperRef: 'Paper 2 (Extended MCQ) · Syllabus 3.1 Transition Metal Compounds',
    questionMs:
      'What is the correct formula for copper(II) carbonate?',
    contextFormula: 'Ions present: Cu²⁺ and CO₃²⁻',
    options: [
      'CuCO₃',
      'Cu₂(CO₃)₂',
      'Cu(CO₃)₂',
      'Cu₂CO₃',
    ],
    correctIndex: 0,
    explanationMs:
      'Copper(II) is Cu²⁺ (+2) and the carbonate ion is CO₃²⁻ (−2). Because the charges +2 and −2 cancel in a 1:1 ratio, the formula is CuCO₃ with no brackets needed.',
    wrongDiagnosisMap: {
      1: 'Cu₂(CO₃)₂ is an unsimplified 2:2 ratio and includes unnecessary brackets. Simplify to 1:1 → CuCO₃.',
      2: 'One CO₃²⁻ (−2) group already balances one Cu²⁺ (+2) ion.',
      3: 'Cu₂CO₃ is copper(I) carbonate (built from Cu⁺), not copper(II) carbonate.',
    },
  },
  {
    id: 'c2-q10',
    chapterId: 'bab2',
    skillId: 'kurungan_poliatomik',
    paperRef: 'Paper 4 (Extended Theory) · Syllabus 3.1 Nitrate Formulae',
    questionMs:
      'Lead(II) nitrate dissolves in water to form a colourless solution. How many total atoms are present in one formula unit of lead(II) nitrate, Pb(NO₃)₂?',
    contextFormula: 'Formula unit: Pb(NO₃)₂',
    options: [
      '9 atoms (1 Pb + 2 N + 6 O)',
      '6 atoms (1 Pb + 1 N + 4 O)',
      '7 atoms (1 Pb + 2 N + 4 O)',
      '5 atoms (1 Pb + 1 N + 3 O)',
    ],
    correctIndex: 0,
    explanationMs:
      'In Pb(NO₃)₂, there is 1 Pb atom. The subscript 2 outside the brackets multiplies everything inside: 2 × 1 N = 2 N atoms, and 2 × 3 O = 6 O atoms. Total = 1 + 2 + 6 = 9 atoms.',
    wrongDiagnosisMap: {
      1: 'The subscript 2 outside the brackets multiplies the 3 oxygen atoms (2 × 3 = 6), not adds to them.',
      2: 'Multiply 3 O atoms by 2 = 6 O atoms (not 4).',
      3: '5 atoms is for a single Pb and one NO₃ group, ignoring the subscript 2 outside the brackets.',
    },
  },

  // ============================================================================
  // CHAPTER 3: Stoichiometry, Symbol Equations & State Symbols (10 Qs)
  // ============================================================================
  {
    id: 'c3-q1',
    chapterId: 'bab3',
    skillId: 'stoikiometri_atom',
    paperRef: 'Paper 2 (Extended MCQ) · Syllabus 3.1 Balancing Equations',
    questionMs:
      'What are the stoichiometric coefficients (x, y, z) required to balance the symbol equation for the formation of aluminium oxide: x Al(s) + y O₂(g) → z Al₂O₃(s)?',
    contextFormula: 'x Al(s) + y O₂(g) → z Al₂O₃(s)',
    options: [
      'x = 4, y = 3, z = 2',
      'x = 2, y = 3, z = 1',
      'x = 2, y = 1, z = 1',
      'x = 4, y = 2, z = 2',
    ],
    correctIndex: 0,
    explanationMs:
      'Oxygen appears as O₂ on the left and O₃ on the right. The lowest common multiple of 2 and 3 is 6 O atoms, requiring y = 3 (3O₂) and z = 2 (2Al₂O₃). Two Al₂O₃ units contain 2 × 2 = 4 Al atoms, so x = 4.',
    wrongDiagnosisMap: {
      1: 'With z = 1, the right side has only 3 O atoms while 3O₂ on the left has 6 O atoms.',
      2: 'With y = 1 (2 O atoms) and z = 1 (3 O atoms), oxygen is unbalanced.',
      3: 'With y = 2 (4 O atoms) and z = 2 (6 O atoms), oxygen is still unbalanced.',
    },
  },
  {
    id: 'c3-q2',
    chapterId: 'bab3',
    skillId: 'simbol_keadaan',
    paperRef: 'Paper 2 (Extended MCQ) · Syllabus 3.1 State Symbols',
    questionMs:
      'Dilute hydrochloric acid reacts with solid calcium carbonate (marble chips) to produce aqueous calcium chloride, water, and carbon dioxide. Which equation has all state symbols correct?',
    contextFormula: 'Reaction of Acid + Insoluble Metal Carbonate',
    options: [
      'CaCO₃(s) + 2HCl(aq) → CaCl₂(aq) + H₂O(l) + CO₂(g)',
      'CaCO₃(aq) + 2HCl(aq) → CaCl₂(s) + H₂O(aq) + CO₂(g)',
      'CaCO₃(s) + 2HCl(l) → CaCl₂(aq) + H₂O(l) + CO₂(g)',
      'CaCO₃(s) + 2HCl(aq) → CaCl₂(aq) + H₂O(aq) + CO₂(g)',
    ],
    correctIndex: 0,
    explanationMs:
      'Marble chips CaCO₃ are an insoluble solid (s), dilute HCl is an aqueous solution (aq), calcium chloride is a soluble salt (aq), pure water is a liquid (l), and carbon dioxide is a gas (g).',
    wrongDiagnosisMap: {
      1: 'CaCO₃ is insoluble (s), CaCl₂ is soluble (aq), and water is always (l), never (aq).',
      2: 'Dilute hydrochloric acid is HCl dissolved in water (aq); pure HCl(g) is a gas.',
      3: 'Water formed in an aqueous reaction is a pure liquid (l), never written as H₂O(aq).',
    },
  },
  {
    id: 'c3-q3',
    chapterId: 'bab3',
    skillId: 'stoikiometri_atom',
    paperRef: 'Paper 4 (Extended Theory) · Syllabus 9.5 Extraction of Iron',
    questionMs:
      'In the blast furnace, iron(III) oxide is reduced by carbon monoxide according to the equation: Fe₂O₃(s) + p CO(g) → q Fe(l) + r CO₂(g). What are the values of p, q, and r?',
    contextFormula: 'Fe₂O₃(s) + p CO(g) → q Fe(l) + r CO₂(g)',
    options: [
      'p = 3, q = 2, r = 3',
      'p = 1, q = 2, r = 1',
      'p = 2, q = 2, r = 2',
      'p = 3, q = 1, r = 3',
    ],
    correctIndex: 0,
    explanationMs:
      'Each CO molecule accepts 1 O atom from Fe₂O₃ to become CO₂. Since Fe₂O₃ contains 3 O atoms, 3 CO molecules are needed to form 3 CO₂ molecules (p = 3, r = 3), releasing 2 Fe atoms (q = 2).',
    wrongDiagnosisMap: {
      1: 'If p = 1 and r = 1, there are 4 O atoms on the left (3 + 1) and only 2 O atoms on the right.',
      2: 'If p = 2 and r = 2, there are 5 O atoms on the left and 4 O atoms on the right.',
      3: 'Fe₂O₃ contains 2 iron atoms, so q must be 2.',
    },
  },
  {
    id: 'c3-q4',
    chapterId: 'bab3',
    skillId: 'stoikiometri_atom',
    paperRef: 'Paper 2 (Extended MCQ) · Syllabus 3.1 Counting Atoms',
    questionMs:
      'How many total oxygen atoms are represented on the product side of the expression: 2 Cu(NO₃)₂(s) ?',
    contextFormula: 'Expression: 2 Cu(NO₃)₂',
    options: [
      '12 oxygen atoms',
      '6 oxygen atoms',
      '5 oxygen atoms',
      '8 oxygen atoms',
    ],
    correctIndex: 0,
    explanationMs:
      'In one formula unit of Cu(NO₃)₂, the subscript 2 outside the brackets multiplies the 3 oxygen atoms inside: 2 × 3 = 6 O atoms. The stoichiometric coefficient 2 in front then doubles the entire unit: 2 × 6 = 12 O atoms.',
    wrongDiagnosisMap: {
      1: '6 is the number of O atoms in a single Cu(NO₃)₂ unit; remember to multiply by the coefficient 2 in front.',
      2: 'Never add subscripts and coefficients; multiply them (2 × 2 × 3 = 12).',
      3: 'Multiply 2 (coefficient) × 2 (bracket subscript) × 3 (oxygen subscript) = 12.',
    },
  },
  {
    id: 'c3-q5',
    chapterId: 'bab3',
    skillId: 'stoikiometri_atom',
    paperRef: 'Paper 4 (Extended Theory) · Syllabus 7.1 Acid-Alkali Titration',
    questionMs:
      'Aqueous phosphoric(V) acid, H₃PO₄, reacts completely with aqueous sodium hydroxide to form sodium phosphate, Na₃PO₄, and water. What is the balanced symbol equation?',
    contextFormula: 'Triprotic Acid Neutralisation: H₃PO₄ + NaOH',
    options: [
      'H₃PO₄(aq) + 3NaOH(aq) → Na₃PO₄(aq) + 3H₂O(l)',
      'H₃PO₄(aq) + NaOH(aq) → Na₃PO₄(aq) + H₂O(l)',
      '3H₃PO₄(aq) + NaOH(aq) → Na₃PO₄(aq) + 3H₂O(l)',
      'H₃PO₄(aq) + 3NaOH(aq) → Na₃PO₄(aq) + H₂O(l)',
    ],
    correctIndex: 0,
    explanationMs:
      'Because Na₃PO₄ contains 3 Na⁺ ions, 3 moles of NaOH are required per mole of H₃PO₄. The 3 H⁺ ions from H₃PO₄ combine with the 3 OH⁻ ions from 3NaOH to produce 3H₂O(l).',
    wrongDiagnosisMap: {
      1: 'Sodium (1 vs 3) and Hydrogen (4 vs 2) are unbalanced.',
      2: 'You multiplied H₃PO₄ by 3 instead of NaOH, leaving P and Na unbalanced.',
      3: 'With 3H₃PO₄ + 3NaOH, there are 6 H atoms on the left, which must form 3H₂O(l) on the right.',
    },
  },
  {
    id: 'c3-q6',
    chapterId: 'bab3',
    skillId: 'stoikiometri_atom',
    paperRef: 'Paper 4 (Extended Theory) · Syllabus 9.4 Thermal Decomposition',
    questionMs:
      'When solid copper(II) nitrate is heated strongly, it decomposes into solid copper(II) oxide, nitrogen dioxide gas, and oxygen gas: 2Cu(NO₃)₂(s) → 2CuO(s) + x NO₂(g) + O₂(g). What is the value of x?',
    contextFormula: '2Cu(NO₃)₂(s) → 2CuO(s) + x NO₂(g) + O₂(g)',
    options: [
      'x = 4',
      'x = 2',
      'x = 3',
      'x = 6',
    ],
    correctIndex: 0,
    explanationMs:
      'On the left side, 2Cu(NO₃)₂ contains 2 × 2 = 4 Nitrogen atoms and 2 × 6 = 12 Oxygen atoms. Therefore, x must be 4 (giving 4 NO₂ molecules with 4 N atoms and 8 O atoms, plus 2 O in 2CuO and 2 O in O₂ = 12 O atoms total).',
    wrongDiagnosisMap: {
      1: '2Cu(NO₃)₂ has 4 nitrogen atoms in total (2 × 2), so x = 2 leaves nitrogen and oxygen unbalanced.',
      2: 'x = 3 gives only 3 nitrogen atoms on the right compared to 4 on the left.',
      3: 'x = 6 gives 6 nitrogen atoms, exceeding the 4 nitrogen atoms on the left.',
    },
  },
  {
    id: 'c3-q7',
    chapterId: 'bab3',
    skillId: 'simbol_keadaan',
    paperRef: 'Paper 2 (Extended MCQ) · Syllabus 7.2 Solubility Rules & State Symbols',
    questionMs:
      'Aqueous barium chloride is mixed with aqueous sodium sulfate. According to IGCSE solubility rules, which product is formed as a solid precipitate (s)?',
    contextFormula: 'BaCl₂(aq) + Na₂SO₄(aq) → BaSO₄(?) + 2NaCl(?)',
    options: [
      'BaSO₄(s) is the white precipitate and 2NaCl(aq) remains in aqueous solution',
      'NaCl(s) is the white precipitate and BaSO₄(aq) remains in aqueous solution',
      'Both BaSO₄(s) and NaCl(s) precipitate out as solids',
      'Both BaSO₄(aq) and NaCl(aq) remain dissolved in solution',
    ],
    correctIndex: 0,
    explanationMs:
      'In the Cambridge IGCSE solubility rules, all sodium salts are soluble (so NaCl is aq), whereas barium sulfate, calcium sulfate, and lead(II) sulfate are insoluble sulfates (so BaSO₄ is a solid precipitate, s).',
    wrongDiagnosisMap: {
      1: 'All Group I (sodium/potassium) salts are soluble in water, so NaCl never precipitates from dilute aqueous solution.',
      2: 'NaCl is completely soluble in water and remains (aq).',
      3: 'Barium sulfate (BaSO₄) is insoluble in water and forms a dense white precipitate (s).',
    },
  },
  {
    id: 'c3-q8',
    chapterId: 'bab3',
    skillId: 'stoikiometri_atom',
    paperRef: 'Paper 2 (Extended MCQ) · Syllabus 3.2 Relative Formula Mass (Mr)',
    questionMs:
      'What is the relative formula mass, Mᵣ, of ammonium sulfate, (NH₄)₂SO₄? [Relative atomic masses, Aᵣ: H = 1, N = 14, O = 16, S = 32]',
    contextFormula: 'Formula: (NH₄)₂SO₄ · Aᵣ: N=14, H=1, S=32, O=16',
    options: [
      '132',
      '114',
      '118',
      '96',
    ],
    correctIndex: 0,
    explanationMs:
      'Each NH₄ group has mass 14 + 4(1) = 18. Two NH₄ groups = 2 × 18 = 36. One S atom = 32. Four O atoms = 4 × 16 = 64. Total Mᵣ = 36 + 32 + 64 = 132.',
    wrongDiagnosisMap: {
      1: 'You calculated only one NH₄ group (18 + 32 + 64 = 114), forgetting the subscript 2 outside (NH₄)₂.',
      2: 'You multiplied only the H atoms by 2 instead of the entire (NH₄) group (14 + 8 + 32 + 64 = 118).',
      3: '96 is the mass of the sulfate ion (SO₄²⁻) alone without the two ammonium ions.',
    },
  },
  {
    id: 'c3-q9',
    chapterId: 'bab3',
    skillId: 'stoikiometri_atom',
    paperRef: 'Paper 4 (Extended Theory) · Syllabus 7.1 Acid + Metal Oxide',
    questionMs:
      'Solid iron(III) oxide reacts with warm dilute sulfuric acid to form iron(III) sulfate and water. Which balanced symbol equation represents this reaction?',
    contextFormula: 'Fe₂O₃(s) + H₂SO₄(aq) → Iron(III) sulfate + Water',
    options: [
      'Fe₂O₃(s) + 3H₂SO₄(aq) → Fe₂(SO₄)₃(aq) + 3H₂O(l)',
      'Fe₂O₃(s) + H₂SO₄(aq) → FeSO₄(aq) + H₂O(l)',
      'FeO(s) + H₂SO₄(aq) → FeSO₄(aq) + H₂O(l)',
      '2Fe₂O₃(s) + 3H₂SO₄(aq) → 2Fe₂(SO₄)₃(aq) + 3H₂O(l)',
    ],
    correctIndex: 0,
    explanationMs:
      'Iron(III) sulfate has the formula Fe₂(SO₄)₃ because Fe is +3 and SO₄ is −2. Balancing the 3 sulfate groups requires 3H₂SO₄(aq), which provides 6 H atoms to combine with the 3 O atoms from Fe₂O₃ to form 3H₂O(l).',
    wrongDiagnosisMap: {
      1: 'FeSO₄ is iron(II) sulfate; iron(III) oxide produces iron(III) sulfate, Fe₂(SO₄)₃.',
      2: 'The reactant specified is iron(III) oxide, Fe₂O₃, not iron(II) oxide, FeO.',
      3: '2Fe₂(SO₄)₃ on the right would require 6 sulfate groups, not 3.',
    },
  },
  {
    id: 'c3-q10',
    chapterId: 'bab3',
    skillId: 'simbol_keadaan',
    paperRef: 'Paper 2 (Extended MCQ) · Syllabus 4.1 Electrolysis State Symbols',
    questionMs:
      'Lead(II) bromide conducts electricity only when molten, decomposing into lead and bromine. Which equation correctly shows the state symbols at the operating temperature of the electrolysis cell?',
    contextFormula: 'Electrolysis of molten lead(II) bromide',
    options: [
      'PbBr₂(l) → Pb(l) + Br₂(g)',
      'PbBr₂(aq) → Pb(s) + Br₂(l)',
      'PbBr₂(s) → Pb(s) + Br₂(g)',
      'PbBr₂(l) → Pb(aq) + 2Br⁻(aq)',
    ],
    correctIndex: 0,
    explanationMs:
      'Molten means melted by heat without any water present, so molten lead(II) bromide is a pure liquid, PbBr₂(l). At the high temperature required to melt PbBr₂, lead collects as molten liquid Pb(l) at the cathode and bromine is evolved as brown vapour Br₂(g) at the anode.',
    wrongDiagnosisMap: {
      1: '(aq) means dissolved in water, whereas PbBr₂ is insoluble in cold water and is electrolysed in the molten state (l).',
      2: 'Solid PbBr₂(s) cannot conduct electricity because its ions are locked in a fixed lattice.',
      3: 'No water is present in molten electrolysis, so (aq) is never used.',
    },
  },

  // ============================================================================
  // CHAPTER 4: Net Ionic Equations, Spectator Ions & Precipitation (10 Qs)
  // ============================================================================
  {
    id: 'c4-q1',
    chapterId: 'bab4',
    skillId: 'persamaan_ionik_bersih',
    paperRef: 'Paper 2 (Extended MCQ) · Syllabus 7.1 Ionic Equation for Neutralisation',
    questionMs:
      'Dilute nitric acid, HNO₃(aq), is neutralised by aqueous potassium hydroxide, KOH(aq). What is the net ionic equation for this reaction?',
    contextFormula: 'HNO₃(aq) + KOH(aq) → KNO₃(aq) + H₂O(l)',
    options: [
      'H⁺(aq) + OH⁻(aq) → H₂O(l)',
      'K⁺(aq) + NO₃⁻(aq) → KNO₃(aq)',
      'H⁺(aq) + OH⁻(aq) → H₂O(aq)',
      'HNO₃(aq) + OH⁻(aq) → NO₃⁻(aq) + H₂O(l)',
    ],
    correctIndex: 0,
    explanationMs:
      'In any reaction between a strong aqueous acid and a strong aqueous alkali, K⁺(aq) and NO₃⁻(aq) remain unchanged in solution as spectator ions. Cancelling them leaves the universal net ionic equation: H⁺(aq) + OH⁻(aq) → H₂O(l).',
    wrongDiagnosisMap: {
      1: 'K⁺ and NO₃⁻ are spectator ions that remain dissociated in solution; they do not form a precipitate.',
      2: 'Water is a pure covalent liquid and must be given the state symbol (l), never (aq).',
      3: 'Nitric acid is a strong acid that completely dissociates into H⁺(aq) and NO₃⁻(aq) in water.',
    },
  },
  {
    id: 'c4-q2',
    chapterId: 'bab4',
    skillId: 'ion_pemerhati',
    paperRef: 'Paper 2 (Extended MCQ) · Syllabus 3.1 Spectator Ions',
    questionMs:
      'Aqueous lead(II) nitrate reacts with aqueous potassium iodide to form a bright yellow precipitate of lead(II) iodide: Pb(NO₃)₂(aq) + 2KI(aq) → PbI₂(s) + 2KNO₃(aq). Which ions are the spectator ions?',
    contextFormula: 'Pb(NO₃)₂(aq) + 2KI(aq) → PbI₂(s) + 2KNO₃(aq)',
    options: [
      'K⁺(aq) and NO₃⁻(aq)',
      'Pb²⁺(aq) and I⁻(aq)',
      'Pb²⁺(aq) and NO₃⁻(aq)',
      'K⁺(aq) and I⁻(aq)',
    ],
    correctIndex: 0,
    explanationMs:
      'Splitting all soluble (aq) compounds gives: Pb²⁺(aq) + 2NO₃⁻(aq) + 2K⁺(aq) + 2I⁻(aq) → PbI₂(s) + 2K⁺(aq) + 2NO₃⁻(aq). Since K⁺(aq) and NO₃⁻(aq) remain unchanged on both sides, they are the spectator ions.',
    wrongDiagnosisMap: {
      1: 'Pb²⁺ and I⁻ are the active reacting ions that bond together to form the solid precipitate PbI₂(s).',
      2: 'Pb²⁺ changes state from (aq) to become locked in the solid precipitate PbI₂(s).',
      3: 'I⁻ changes state from (aq) to become part of the solid precipitate PbI₂(s).',
    },
  },
  {
    id: 'c4-q3',
    chapterId: 'bab4',
    skillId: 'persamaan_ionik_bersih',
    paperRef: 'Paper 4 (Extended Theory) · Syllabus 12.3 Qualitative Analysis of Halides',
    questionMs:
      'Aqueous silver nitrate is added to acidified aqueous magnesium bromide, forming a cream precipitate. What is the correct net ionic equation for this reaction?',
    contextFormula: '2AgNO₃(aq) + MgBr₂(aq) → 2AgBr(s) + Mg(NO₃)₂(aq)',
    options: [
      'Ag⁺(aq) + Br⁻(aq) → AgBr(s)',
      '2Ag⁺(aq) + Br₂²⁻(aq) → 2AgBr(s)',
      'Mg²⁺(aq) + 2NO₃⁻(aq) → Mg(NO₃)₂(s)',
      'Ag²⁺(aq) + 2Br⁻(aq) → AgBr₂(s)',
    ],
    correctIndex: 0,
    explanationMs:
      'After cancelling the spectator ions Mg²⁺(aq) and NO₃⁻(aq) and simplifying the 2:2 stoichiometric ratio to 1:1, the net ionic equation is Ag⁺(aq) + Br⁻(aq) → AgBr(s).',
    wrongDiagnosisMap: {
      1: 'Bromide ions in solution exist as separate Br⁻(aq) ions, never as a diatomic Br₂²⁻ ion.',
      2: 'Magnesium nitrate is soluble in water (aq) and remains in solution as spectator ions.',
      3: 'Silver forms Ag⁺ (+1) and bromide is Br⁻ (−1), giving AgBr(s), not AgBr₂.',
    },
  },
  {
    id: 'c4-q4',
    chapterId: 'bab4',
    skillId: 'persamaan_ionik_bersih',
    paperRef: 'Paper 4 (Extended Theory) · Syllabus 9.3 Metal Displacement',
    questionMs:
      'Zinc powder is added to blue aqueous copper(II) sulfate, producing a reddish-brown solid of copper and colourless aqueous zinc sulfate: Zn(s) + CuSO₄(aq) → ZnSO₄(aq) + Cu(s). What is the ionic equation for this redox reaction?',
    contextFormula: 'Zn(s) + CuSO₄(aq) → ZnSO₄(aq) + Cu(s)',
    options: [
      'Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s)',
      'Zn²⁺(s) + Cu(aq) → Zn(aq) + Cu²⁺(s)',
      'Zn(s) + SO₄²⁻(aq) → ZnSO₄(aq)',
      'Cu²⁺(aq) + SO₄²⁻(aq) → CuSO₄(s)',
    ],
    correctIndex: 0,
    explanationMs:
      'The sulfate ion, SO₄²⁻(aq), remains unchanged in solution on both sides and is cancelled as the spectator ion. Metallic solids Zn(s) and Cu(s) have zero charge, leaving Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s).',
    wrongDiagnosisMap: {
      1: 'Uncombined solid metals Zn(s) and Cu(s) are neutral atoms (0 charge), whereas dissolved ions carry +2 charges.',
      2: 'SO₄²⁻(aq) is the spectator ion and does not change oxidation state or physical state.',
      3: 'Copper(II) sulfate is a soluble reactant, not a precipitate.',
    },
  },
  {
    id: 'c4-q5',
    chapterId: 'bab4',
    skillId: 'persamaan_ionik_bersih',
    paperRef: 'Paper 4 (Extended Theory) · Syllabus 12.3 Test for Iron(III) Ions',
    questionMs:
      'When aqueous sodium hydroxide is added to aqueous iron(III) chloride, a reddish-brown precipitate is formed. Construct the balanced net ionic equation for this precipitation reaction.',
    contextFormula: 'FeCl₃(aq) + 3NaOH(aq) → Fe(OH)₃(s) + 3NaCl(aq)',
    options: [
      'Fe³⁺(aq) + 3OH⁻(aq) → Fe(OH)₃(s)',
      'Fe³⁺(aq) + OH⁻(aq) → FeOH²⁺(s)',
      'Fe²⁺(aq) + 2OH⁻(aq) → Fe(OH)₂(s)',
      'Na⁺(aq) + Cl⁻(aq) → NaCl(s)',
    ],
    correctIndex: 0,
    explanationMs:
      'Iron(III) ions carry a +3 charge, Fe³⁺(aq), and require 3 hydroxide ions, 3OH⁻(aq), to form the electrically neutral insoluble precipitate Fe(OH)₃(s). Na⁺(aq) and Cl⁻(aq) are spectator ions.',
    wrongDiagnosisMap: {
      1: 'Three OH⁻ ions are required to neutralise the +3 charge of Fe³⁺ and form the neutral precipitate Fe(OH)₃(s).',
      2: 'Fe²⁺ + 2OH⁻ → Fe(OH)₂(s) is the equation for green iron(II) hydroxide, not iron(III) hydroxide.',
      3: 'Sodium chloride is soluble and remains dissolved as spectator ions Na⁺(aq) and Cl⁻(aq).',
    },
  },
  {
    id: 'c4-q6',
    chapterId: 'bab4',
    skillId: 'persamaan_ionik_bersih',
    paperRef: 'Paper 4 (Extended Theory) · Syllabus 7.1 Carbonate + Acid Ionic Equation',
    questionMs:
      'Aqueous sodium carbonate reacts with dilute hydrochloric acid to produce sodium chloride, water, and carbon dioxide gas: Na₂CO₃(aq) + 2HCl(aq) → 2NaCl(aq) + H₂O(l) + CO₂(g). What is the net ionic equation?',
    contextFormula: 'Na₂CO₃(aq) + 2HCl(aq) → 2NaCl(aq) + H₂O(l) + CO₂(g)',
    options: [
      'CO₃²⁻(aq) + 2H⁺(aq) → H₂O(l) + CO₂(g)',
      'Na₂CO₃(s) + 2H⁺(aq) → 2Na⁺(aq) + H₂O(l) + CO₂(g)',
      '2Na⁺(aq) + 2Cl⁻(aq) → 2NaCl(aq)',
      'CO₃²⁻(aq) + H⁺(aq) → HCO₃⁻(g)',
    ],
    correctIndex: 0,
    explanationMs:
      'Because sodium carbonate is soluble (aq), it splits into 2Na⁺(aq) and CO₃²⁻(aq). Cancelling both spectator ions 2Na⁺(aq) and 2Cl⁻(aq) leaves CO₃²⁻(aq) + 2H⁺(aq) → H₂O(l) + CO₂(g).',
    wrongDiagnosisMap: {
      1: 'Aqueous sodium carbonate is completely soluble (aq), so 2Na⁺(aq) is a spectator ion and must be cancelled.',
      2: 'Na⁺ and Cl⁻ do not react; they are spectator ions.',
      3: 'Two H⁺ ions react with one CO₃²⁻ ion to liberate CO₂(g) and H₂O(l).',
    },
  },
  {
    id: 'c4-q7',
    chapterId: 'bab4',
    skillId: 'ion_pemerhati',
    paperRef: 'Paper 2 (Extended MCQ) · Syllabus 7.1 Acid + Metal Redox',
    questionMs:
      'Magnesium ribbon dissolves with rapid effervescence in dilute sulfuric acid: Mg(s) + H₂SO₄(aq) → MgSO₄(aq) + H₂(g). Which species is the spectator ion, and why is Mg(s) not split into ions on the left?',
    contextFormula: 'Mg(s) + 2H⁺(aq) + SO₄²⁻(aq) → Mg²⁺(aq) + SO₄²⁻(aq) + H₂(g)',
    options: [
      'SO₄²⁻(aq) is the spectator ion; Mg(s) consists of neutral metal atoms (oxidation state 0), not ions',
      'H⁺(aq) is the spectator ion; Mg(s) is an insoluble ionic salt',
      'Mg²⁺(aq) is the spectator ion; H₂SO₄ is a covalent gas',
      'SO₄²⁻(aq) is the spectator ion; Mg(s) is a covalent molecule',
    ],
    correctIndex: 0,
    explanationMs:
      'Only SO₄²⁻(aq) remains unchanged on both sides. Solid magnesium Mg(s) is an uncombined metallic element made of neutral atoms (charge 0); it only becomes Mg²⁺(aq) after losing 2 electrons to 2H⁺(aq).',
    wrongDiagnosisMap: {
      1: 'H⁺(aq) is reduced to H₂(g) gas, so it is a reacting species, not a spectator ion.',
      2: 'Mg(s) is oxidised to Mg²⁺(aq), so its state and charge change during the reaction.',
      3: 'Magnesium is a metallic element (giant metallic lattice), not a covalent molecule.',
    },
  },
  {
    id: 'c4-q8',
    chapterId: 'bab4',
    skillId: 'persamaan_ionik_bersih',
    paperRef: 'Paper 4 (Extended Theory) · Syllabus 12.3 Sulfate Ion Test',
    questionMs:
      'Aqueous barium nitrate is added to acidified aqueous aluminium sulfate, producing a white precipitate of barium sulfate. What is the simplest net ionic equation for this reaction?',
    contextFormula: '3Ba(NO₃)₂(aq) + Al₂(SO₄)₃(aq) → 3BaSO₄(s) + 2Al(NO₃)₃(aq)',
    options: [
      'Ba²⁺(aq) + SO₄²⁻(aq) → BaSO₄(s)',
      '3Ba²⁺(aq) + (SO₄)₃⁶⁻(aq) → 3BaSO₄(s)',
      '2Al³⁺(aq) + 6NO₃⁻(aq) → 2Al(NO₃)₃(s)',
      'Ba⁺(aq) + SO₄⁻(aq) → BaSO₄(s)',
    ],
    correctIndex: 0,
    explanationMs:
      'Cancelling 2Al³⁺(aq) and 6NO₃⁻(aq) leaves 3Ba²⁺(aq) + 3SO₄²⁻(aq) → 3BaSO₄(s). Dividing all coefficients by 3 gives the simplest empirical net ionic equation: Ba²⁺(aq) + SO₄²⁻(aq) → BaSO₄(s).',
    wrongDiagnosisMap: {
      1: 'In solution, three sulfate ions exist as 3 separate SO₄²⁻(aq) ions, which simplify by dividing by 3.',
      2: 'Aluminium nitrate is soluble (aq) and remains dissolved as spectator ions.',
      3: 'Barium is in Group II (Ba²⁺) and sulfate carries a −2 charge (SO₄²⁻).',
    },
  },
  {
    id: 'c4-q9',
    chapterId: 'bab4',
    skillId: 'persamaan_ionik_bersih',
    paperRef: 'Paper 2 (Extended MCQ) · Syllabus 8.2 Halogen Displacement',
    questionMs:
      'Chlorine gas is bubbled into colourless aqueous potassium bromide, turning the solution orange-brown: Cl₂(g) + 2KBr(aq) → 2KCl(aq) + Br₂(aq). What is the ionic equation for this halogen displacement reaction?',
    contextFormula: 'Cl₂(g) + 2KBr(aq) → 2KCl(aq) + Br₂(aq)',
    options: [
      'Cl₂(g) + 2Br⁻(aq) → 2Cl⁻(aq) + Br₂(aq)',
      '2Cl⁻(g) + Br₂(aq) → Cl₂(aq) + 2Br⁻(aq)',
      'Cl₂(g) + 2K⁺(aq) → 2KCl(aq)',
      'K⁺(aq) + Br⁻(aq) → KBr(s)',
    ],
    correctIndex: 0,
    explanationMs:
      'Potassium ions, 2K⁺(aq), remain unchanged in solution on both sides and are cancelled as spectator ions. Chlorine molecules Cl₂(g) gain electrons from 2Br⁻(aq) ions to form 2Cl⁻(aq) and aqueous bromine molecules Br₂(aq).',
    wrongDiagnosisMap: {
      1: 'Reactant chlorine is a neutral diatomic molecule Cl₂(g), whereas bromide in KBr(aq) is an ion, Br⁻(aq).',
      2: 'K⁺(aq) is the spectator ion and does not undergo any chemical change.',
      3: 'No precipitate is formed; K⁺(aq) is the spectator ion.',
    },
  },
  {
    id: 'c4-q10',
    chapterId: 'bab4',
    skillId: 'persamaan_ionik_bersih',
    paperRef: 'Paper 4 (Extended Theory) · Syllabus 7.1 Ammonium Salt + Alkali',
    questionMs:
      'When aqueous ammonium chloride is warmed with aqueous sodium hydroxide, pungent ammonia gas is evolved: NH₄Cl(aq) + NaOH(aq) → NaCl(aq) + NH₃(g) + H₂O(l). What is the net ionic equation?',
    contextFormula: 'NH₄Cl(aq) + NaOH(aq) → NaCl(aq) + NH₃(g) + H₂O(l)',
    options: [
      'NH₄⁺(aq) + OH⁻(aq) → NH₃(g) + H₂O(l)',
      'NH₄⁺(aq) + Cl⁻(aq) → NH₃(g) + HCl(g)',
      'Na⁺(aq) + Cl⁻(aq) → NaCl(s)',
      'NH₄Cl(s) + OH⁻(aq) → NH₃(g) + H₂O(l) + Cl⁻(aq)',
    ],
    correctIndex: 0,
    explanationMs:
      'Splitting all soluble aqueous electrolytes gives NH₄⁺(aq) + Cl⁻(aq) + Na⁺(aq) + OH⁻(aq) → Na⁺(aq) + Cl⁻(aq) + NH₃(g) + H₂O(l). Cancelling spectator ions Na⁺(aq) and Cl⁻(aq) yields NH₄⁺(aq) + OH⁻(aq) → NH₃(g) + H₂O(l).',
    wrongDiagnosisMap: {
      1: 'Hydroxide ions OH⁻(aq) deprotonate NH₄⁺(aq) to form NH₃(g) and H₂O(l); Cl⁻ is a spectator ion.',
      2: 'Na⁺(aq) and Cl⁻(aq) remain dissolved in solution as spectator ions.',
      3: 'NH₄Cl(aq) is dissolved in water, so Cl⁻(aq) is present on both sides and cancels out.',
    },
  },
];
