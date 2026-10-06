import { jsPDF } from 'jspdf';
import {
  CHAPTERS,
  QuizAttemptRecord,
  StudentMasterRecord,
  WEAKNESS_SKILLS,
  WeaknessSkillId,
  resolveAttemptQuestionResponses,
  getStudentNormalizedKey,
} from '../data/chemistryData';

/**
 * Converts Unicode chemical subscripts, superscripts, and special math characters
 * into clean, readable Latin-1/ASCII text so standard PDF fonts render 100% clearly
 * without any missing glyph boxes.
 */
export function formatPdfSafeText(input: string): string {
  if (!input) return '';

  let s = input;

  // Handle specific isotope notations before general replacements
  s = s.replace(/¹⁴₇N³⁻/g, '14/7 N(3-)');

  // Group superscript charges cleanly, e.g. SO₄²⁻ -> SO4(2-), Al³⁺ -> Al(3+)
  const supMap: Record<string, string> = {
    '⁰': '0',
    '¹': '1',
    '²': '2',
    '³': '3',
    '⁴': '4',
    '⁵': '5',
    '⁶': '6',
    '⁷': '7',
    '⁸': '8',
    '⁹': '9',
    '⁺': '+',
    '⁻': '-',
  };

  s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+[⁺⁻]/g, (match) => {
    const converted = match
      .split('')
      .map((ch) => supMap[ch] || ch)
      .join('');
    return `(${converted})`;
  });

  s = s.replace(/[⁺⁻]/g, (ch) => supMap[ch] || ch);
  s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (ch) => supMap[ch] || ch);

  // Convert Unicode subscripts to standard numbers
  const subMap: Record<string, string> = {
    '₀': '0',
    '₁': '1',
    '₂': '2',
    '₃': '3',
    '₄': '4',
    '₅': '5',
    '₆': '6',
    '₇': '7',
    '₈': '8',
    '₉': '9',
    'ᵣ': 'r',
  };

  s = s.replace(/[₀₁₂₃₄₅₆₇₈₉ᵣ]/g, (ch) => subMap[ch] || ch);

  // Convert arrows, math operators, and punctuation to PDF-safe equivalents
  s = s
    .replace(/→/g, '->')
    .replace(/←/g, '<-')
    .replace(/⇌/g, '<=>')
    .replace(/[−–—]/g, '-')
    .replace(/×/g, 'x')
    .replace(/[·•●◆▲○]/g, '|')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/Brønsted/g, 'Bronsted');

  return s;
}

function getGradeBadge(scorePercent: number): string {
  if (scorePercent >= 80) return 'DISTINCTION (Grade A*/A)';
  if (scorePercent >= 60) return 'MERIT (Grade B/C)';
  return 'NEEDS REVISION (Review Feedback Below)';
}

function buildOverallStudentComment(
  record: StudentMasterRecord,
  attempts: QuizAttemptRecord[]
): string {
  if (attempts.length === 0) {
    return 'No quiz attempts have been completed yet.';
  }

  // Aggregate weakness skills for this student
  const skillTotals: Record<WeaknessSkillId, { correct: number; total: number }> = {
    valensi_kumpulan: { correct: 0, total: 0 },
    logam_peralihan: { correct: 0, total: 0 },
    kurungan_poliatomik: { correct: 0, total: 0 },
    nisbah_ringkas: { correct: 0, total: 0 },
    stoikiometri_atom: { correct: 0, total: 0 },
    simbol_keadaan: { correct: 0, total: 0 },
    ion_pemerhati: { correct: 0, total: 0 },
    persamaan_ionik_bersih: { correct: 0, total: 0 },
  };

  attempts.forEach((att) => {
    (Object.keys(skillTotals) as WeaknessSkillId[]).forEach((sk) => {
      const entry = att.skillBreakdown?.[sk];
      if (entry) {
        skillTotals[sk].correct += entry.correct;
        skillTotals[sk].total += entry.total;
      }
    });
  });

  const weakSkills = (Object.keys(skillTotals) as WeaknessSkillId[])
    .filter((sk) => skillTotals[sk].total > 0)
    .map((sk) => ({
      meta: WEAKNESS_SKILLS[sk],
      acc: Math.round((skillTotals[sk].correct / skillTotals[sk].total) * 100),
    }))
    .filter((x) => x.acc < 80)
    .sort((a, b) => a.acc - b.acc);

  if (record.overallAverageLatest >= 85 && weakSkills.length === 0) {
    return `${record.studentName} demonstrates strong mastery of Cambridge IGCSE ionic formulae, stoichiometric balancing, and net ionic equations (${record.overallAverageLatest}% revised average). Keep practising Paper 4 extended theory questions to maintain Distinction standard.`;
  }

  if (weakSkills.length > 0) {
    const topWeakNames = weakSkills
      .slice(0, 2)
      .map((w) => `${w.meta.titleMs} (${w.acc}%)`)
      .join(' and ');
    const topRemedy = weakSkills[0].meta.remedyExplanationMs;
    return `${record.studentName} has a revised overall average of ${record.overallAverageLatest}% across ${record.totalAttempts} attempt(s). Priority areas requiring revision: ${topWeakNames}. Key Cambridge IGCSE Advice: ${topRemedy}`;
  }

  return `${record.studentName} has achieved a revised average of ${record.overallAverageLatest}% across ${record.totalAttempts} attempt(s). Review the question-by-question examiner comments below for any missed questions.`;
}

/**
 * Internal renderer that draws a complete student section (header, chapter summary,
 * overall teacher feedback, and every attempt's 10 questions, student's own answers,
 * marks awarded, and detailed examiner feedback for every wrong question) onto a jsPDF doc.
 */
function renderStudentReportSection(
  doc: jsPDF,
  studentRecord: StudentMasterRecord,
  studentAttempts: QuizAttemptRecord[],
  startOnNewPage: boolean
) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 16;

  if (startOnNewPage) {
    doc.addPage();
    y = 16;
  }

  const ensureSpace = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 16) {
      doc.addPage();
      y = 16;
    }
  };

  // Top Header Banner
  doc.setFillColor(15, 23, 42); // Slate-900
  doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'F');

  doc.setTextColor(56, 189, 248); // Sky-400
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(
    'CHEMBALANCE PRO 2.0  |  CAMBRIDGE IGCSE CHEMISTRY (0620) ASSESSMENT REPORT',
    margin + 5,
    y + 7
  );

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text(
    formatPdfSafeText(`Student: ${studentRecord.studentName}   (Class: ${studentRecord.studentClass})`),
    margin + 5,
    y + 15
  );

  doc.setTextColor(203, 213, 225);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const datePrinted = new Date().toISOString().slice(0, 10);
  doc.text(
    formatPdfSafeText(
      `Revised Overall Average: ${studentRecord.overallAverageLatest}%  |  Standing: ${getGradeBadge(
        studentRecord.overallAverageLatest
      )}  |  Total Attempts: ${studentRecord.totalAttempts}  |  Date: ${datePrinted}`
    ),
    margin + 5,
    y + 22
  );

  y += 31;

  // Chapter Revision Summary Bar
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 16, 1.5, 1.5, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('REVISED CHAPTER SCORES (LATEST SCORE REVISION BY STUDENT NAME):', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const chapSummaries = CHAPTERS.map((ch) => {
    const rev = studentRecord.chapters[ch.id];
    if (!rev) return `${ch.number}: Not Attempted`;
    const prevStr =
      rev.previousScorePercent !== null ? ` [Prev: ${rev.previousScorePercent}%]` : '';
    return `${ch.number}: ${rev.latestScorePercent}% (${rev.latestCorrectCount}/${rev.totalQuestions})${prevStr}`;
  }).join('   |   ');

  doc.text(formatPdfSafeText(chapSummaries), margin + 4, y + 12.5);
  y += 20;

  // Overall Diagnostic Teacher Comment Box
  const overallComment = formatPdfSafeText(
    buildOverallStudentComment(studentRecord, studentAttempts)
  );
  const commentLines = doc.splitTextToSize(overallComment, contentWidth - 8);
  const commentBoxH = 10 + commentLines.length * 4.2;
  ensureSpace(commentBoxH + 6);

  doc.setFillColor(240, 249, 255); // Sky-50
  doc.setDrawColor(125, 211, 252); // Sky-300
  doc.roundedRect(margin, y, contentWidth, commentBoxH, 1.5, 1.5, 'FD');

  doc.setTextColor(3, 105, 161); // Sky-700
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('OVERALL EXAMINER DIAGNOSTIC COMMENT & REMEDIAL GUIDANCE:', margin + 4, y + 5.5);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(commentLines, margin + 4, y + 10.5);

  y += commentBoxH + 6;

  // Render Each Quiz Attempt & All 10 Questions + Student Answers + Marks + Wrong Question Feedback
  const chronologicalAttempts = [...studentAttempts];

  chronologicalAttempts.forEach((attempt, attIdx) => {
    const chapMeta =
      CHAPTERS.find((c) => c.id === attempt.chapterId) || CHAPTERS[0];
    const responses = resolveAttemptQuestionResponses(attempt);
    const wrongCount = responses.filter((r) => !r.isCorrect).length;

    ensureSpace(22);

    // Attempt Section Subheader
    doc.setFillColor(30, 41, 59); // Slate-800
    doc.roundedRect(margin, y, contentWidth, 12, 1.5, 1.5, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(
      formatPdfSafeText(
        `ATTEMPT SCRIPT #${attIdx + 1}: ${chapMeta.number} - ${chapMeta.titleMs} (${attempt.dateLabel})`
      ),
      margin + 4,
      y + 5.2
    );

    doc.setTextColor(167, 243, 208); // Emerald-200
    doc.setFontSize(8.5);
    doc.text(
      formatPdfSafeText(
        `Marks Awarded: ${attempt.correctCount} / ${attempt.totalQuestions} (${attempt.scorePercent}%)   |   Wrong Questions: ${wrongCount}   |   Recorded: ${attempt.timestamp
          .slice(0, 16)
          .replace('T', ' ')}`
      ),
      margin + 4,
      y + 10
    );

    y += 15;

    // Question-by-question breakdown
    responses.forEach((resp) => {
      const qTitle = formatPdfSafeText(
        `Q${resp.questionNumber}. ${resp.questionText}`
      );
      const qContext = resp.contextFormula
        ? formatPdfSafeText(`Context / Formula: ${resp.contextFormula}   (${resp.paperRef || 'Cambridge IGCSE'})`)
        : formatPdfSafeText(`Source: ${resp.paperRef || 'Cambridge IGCSE'}`);

      const studentAnsLine = formatPdfSafeText(
        `Student's Answer: ${resp.chosenAnswerText}`
      );
      const correctAnsLine = formatPdfSafeText(
        `Correct Mark Scheme Answer: ${resp.correctAnswerText}`
      );

      const commentLine = !resp.isCorrect
        ? formatPdfSafeText(
            `Examiner Comment on Error (${resp.skillTitle}): ${resp.wrongAnswerComment}`
          )
        : formatPdfSafeText(`Examiner Comment: Correct answer selected. Full mark awarded.`);

      const feedbackLine = formatPdfSafeText(
        `Examiner Feedback & Explanation: ${resp.remedialFeedback}`
      );

      const qTitleLines = doc.splitTextToSize(qTitle, contentWidth - 36);
      const studentAnsLines = doc.splitTextToSize(studentAnsLine, contentWidth - 8);
      const correctAnsLines = !resp.isCorrect
        ? doc.splitTextToSize(correctAnsLine, contentWidth - 8)
        : [];
      const commentLinesArr = doc.splitTextToSize(commentLine, contentWidth - 8);
      const feedbackLinesArr = doc.splitTextToSize(feedbackLine, contentWidth - 8);

      const cardHeight =
        12 +
        qTitleLines.length * 4 +
        studentAnsLines.length * 4 +
        correctAnsLines.length * 4 +
        commentLinesArr.length * 3.9 +
        feedbackLinesArr.length * 3.9 +
        (!resp.isCorrect ? 6 : 2);

      ensureSpace(cardHeight + 4);

      // Card background (light red tint for wrong questions, light green tint for correct)
      if (resp.isCorrect) {
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(203, 213, 225);
      } else {
        doc.setFillColor(255, 241, 242); // Rose-50 tint for wrong question
        doc.setDrawColor(253, 164, 175); // Rose-300 border
      }
      doc.roundedRect(margin, y, contentWidth, cardHeight, 1.5, 1.5, 'FD');

      // Mark Badge on Top Right of Question Card
      if (resp.isCorrect) {
        doc.setFillColor(5, 150, 105); // Emerald-600
      } else {
        doc.setFillColor(225, 29, 72); // Rose-600
      }
      doc.roundedRect(pageWidth - margin - 31, y + 2.5, 28, 6, 1, 1, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text(
        resp.isCorrect ? 'MARK: 1 / 1' : 'MARK: 0 / 1',
        pageWidth - margin - 17,
        y + 6.5,
        { align: 'center' }
      );

      let curY = y + 5.5;

      // Context / Paper Ref
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text(qContext, margin + 3.5, curY);
      curY += 4.5;

      // Question Prompt
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text(qTitleLines, margin + 3.5, curY);
      curY += qTitleLines.length * 4 + 1;

      // Student's Own Answer
      if (resp.isCorrect) {
        doc.setTextColor(4, 120, 87); // Emerald-700
      } else {
        doc.setTextColor(190, 18, 60); // Rose-700
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text(studentAnsLines, margin + 3.5, curY);
      curY += studentAnsLines.length * 4;

      // Correct Answer (shown when student got it wrong)
      if (!resp.isCorrect && correctAnsLines.length > 0) {
        doc.setTextColor(4, 120, 87); // Emerald-700
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text(correctAnsLines, margin + 3.5, curY);
        curY += correctAnsLines.length * 4 + 0.5;
      }

      // Examiner Comment on Wrong Answer
      if (!resp.isCorrect) {
        doc.setTextColor(159, 18, 57); // Rose-800
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setTextColor(71, 85, 105);
        doc.setFont('helvetica', 'normal');
      }
      doc.setFontSize(7.8);
      doc.text(commentLinesArr, margin + 3.5, curY);
      curY += commentLinesArr.length * 3.9 + 0.5;

      // Remedial Feedback & Model Explanation
      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.8);
      doc.text(feedbackLinesArr, margin + 3.5, curY);

      y += cardHeight + 3.5;
    });

    y += 3;
  });
}

function addPageFooters(doc: jsPDF) {
  const totalPages = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `ChemBalance Pro 2.0  |  Cambridge IGCSE Chemistry (0620) Student Question & Answer Feedback Report  |  Page ${p} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 7,
      { align: 'center' }
    );
  }
}

/**
 * Downloads a complete PDF report for a single student containing all their quiz attempts,
 * questions, their own answers, marks for each question, and examiner comments & feedback
 * for every wrong question.
 */
export function downloadSingleStudentPdfReport(
  studentRecord: StudentMasterRecord,
  allAttempts: QuizAttemptRecord[]
) {
  const studentAttempts = allAttempts.filter(
    (att) =>
      getStudentNormalizedKey(att.studentClass, att.studentName) ===
      studentRecord.normalizedKey
  );

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  renderStudentReportSection(doc, studentRecord, studentAttempts, false);
  addPageFooters(doc);

  const safeName = studentRecord.studentName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeClass = studentRecord.studentClass.replace(/[^a-zA-Z0-9_-]/g, '_');
  const dateStr = new Date().toISOString().slice(0, 10);
  doc.save(
    `ChemBalance_Pro_2.0_${safeClass}_${safeName}_Questions_Answers_Feedback_${dateStr}.pdf`
  );
}

/**
 * Downloads a PDF report for a single specific quiz attempt.
 */
export function downloadSingleAttemptPdfReport(attempt: QuizAttemptRecord) {
  const singleRecord: StudentMasterRecord = {
    normalizedKey: getStudentNormalizedKey(
      attempt.studentClass,
      attempt.studentName
    ),
    studentName: attempt.studentName || 'Student',
    studentClass: attempt.studentClass || '305',
    totalAttempts: 1,
    lastActiveTimestamp: attempt.timestamp,
    chapters: {
      [attempt.chapterId]: {
        chapterId: attempt.chapterId,
        latestScorePercent: attempt.scorePercent,
        latestCorrectCount: attempt.correctCount,
        totalQuestions: attempt.totalQuestions,
        previousScorePercent: null,
        attemptsCount: 1,
        lastUpdatedTimestamp: attempt.timestamp,
      },
    },
    overallAverageLatest: attempt.scorePercent,
  };

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  renderStudentReportSection(doc, singleRecord, [attempt], false);
  addPageFooters(doc);

  const safeName = singleRecord.studentName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const chapStr = attempt.chapterId.replace('bab', 'Chapter_0');
  const dateStr = new Date().toISOString().slice(0, 10);
  doc.save(
    `ChemBalance_Pro_2.0_${safeName}_${chapStr}_${attempt.dateLabel.replace(
      /\s+/g,
      '_'
    )}_Report_${dateStr}.pdf`
  );
}

/**
 * Downloads a multi-student PDF report containing each selected/active student's
 * full questions, own answers, marks, and examiner feedback for every wrong question.
 */
export function downloadMultipleStudentsPdfReport(
  studentRecords: StudentMasterRecord[],
  allAttempts: QuizAttemptRecord[],
  classFilterLabel: string = 'All_Classes'
) {
  if (studentRecords.length === 0) return;
  if (studentRecords.length === 1) {
    downloadSingleStudentPdfReport(studentRecords[0], allAttempts);
    return;
  }

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  studentRecords.forEach((rec, index) => {
    const stuAttempts = allAttempts.filter(
      (att) =>
        getStudentNormalizedKey(att.studentClass, att.studentName) ===
        rec.normalizedKey
    );
    renderStudentReportSection(doc, rec, stuAttempts, index > 0);
  });

  addPageFooters(doc);

  const safeFilter = classFilterLabel.replace(/[^a-zA-Z0-9_-]/g, '_');
  const dateStr = new Date().toISOString().slice(0, 10);
  doc.save(
    `ChemBalance_Pro_2.0_Cambridge_IGCSE_Student_Scripts_Feedback_${safeFilter}_${dateStr}.pdf`
  );
}
