import React, { useState, useMemo } from 'react';
import {
  CHAPTERS,
  QUIZ_QUESTIONS,
  WEAKNESS_SKILLS,
  PRESET_CLASSES,
  QuizAttemptRecord,
  QuizQuestion,
  StudentMasterRecord,
  StudentQuestionResponse,
  WeaknessSkillId,
  CATIONS,
  ANIONS,
  IonItem,
  buildStudentMasterRecords,
  getStudentNormalizedKey,
} from '../data/chemistryData';
import {
  downloadStudentRecordsExcel,
  downloadStudentRecordsCsv,
} from '../utils/excelExport';
import {
  downloadSingleStudentPdfReport,
  downloadMultipleStudentsPdfReport,
  downloadSingleAttemptPdfReport,
} from '../utils/pdfExport';
import {
  Play,
  RotateCcw,
  ArrowRight,
  TrendingUp,
  Target,
  BookOpen,
  UserCheck,
  Users,
  Trash2,
  ArchiveRestore,
  Download,
  FileSpreadsheet,
  FileText,
  CheckSquare,
  GraduationCap,
} from 'lucide-react';

interface QuizAndAnalyticsViewProps {
  quizHistory: QuizAttemptRecord[];
  deletedStudentKeys: string[];
  onSaveAttempt: (attempt: QuizAttemptRecord) => void;
  onSoftDeleteStudents: (normalizedKeys: string[]) => void;
  onRestoreStudents: (normalizedKeys: string[]) => void;
  onPermanentDeleteStudents: (normalizedKeys: string[]) => void;
  onResetHistory: () => void;
  onPracticeWeaknessInBalancer: (cation: IonItem, anion: IonItem) => void;
  isDark: boolean;
}

/**
 * Randomly shuffles the answer choices (options A, B, C, D) for each question
 * on every quiz attempt using the Fisher–Yates shuffle, while remapping
 * `correctIndex` and `wrongDiagnosisMap` to match the new option positions.
 */
function shuffleQuestionChoices(questions: QuizQuestion[]): QuizQuestion[] {
  return questions.map((q) => {
    const indexedOptions = q.options.map((text, origIdx) => ({
      text,
      origIdx,
    }));

    for (let i = indexedOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = indexedOptions[i];
      indexedOptions[i] = indexedOptions[j];
      indexedOptions[j] = temp;
    }

    const newOptions = indexedOptions.map((item) => item.text);
    const newCorrectIndex = indexedOptions.findIndex(
      (item) => item.origIdx === q.correctIndex
    );

    const newWrongDiagnosisMap: Record<number, string> = {};
    indexedOptions.forEach((item, newIdx) => {
      if (item.origIdx !== q.correctIndex && q.wrongDiagnosisMap[item.origIdx]) {
        newWrongDiagnosisMap[newIdx] = q.wrongDiagnosisMap[item.origIdx];
      }
    });

    return {
      ...q,
      options: newOptions,
      correctIndex: newCorrectIndex,
      wrongDiagnosisMap: newWrongDiagnosisMap,
    };
  });
}

export const QuizAndAnalyticsView: React.FC<QuizAndAnalyticsViewProps> = ({
  quizHistory,
  deletedStudentKeys,
  onSaveAttempt,
  onSoftDeleteStudents,
  onRestoreStudents,
  onPermanentDeleteStudents,
  onResetHistory,
  onPracticeWeaknessInBalancer,
  isDark,
}) => {
  const [studentClassInput, setStudentClassInput] = useState<string>('305');
  const [studentNameInput, setStudentNameInput] = useState<string>('Daniel');
  const [classFilter, setClassFilter] = useState<string>('ALL');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('bab1');
  const [isPlayingQuiz, setIsPlayingQuiz] = useState<boolean>(false);
  const [sessionQuestions, setSessionQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [sessionAnswers, setSessionAnswers] = useState<StudentQuestionResponse[]>([]);
  const [justCompletedAttempt, setJustCompletedAttempt] = useState<QuizAttemptRecord | null>(
    null
  );

  // Registry tabs: 'master' (Active Student Records), 'deleted' (Trash / Restore Bin), 'log' (All Attempts Log)
  const [recordViewTab, setRecordViewTab] = useState<'master' | 'deleted' | 'log'>('master');
  // Selected student keys (checkboxes) for bulk delete or bulk restore
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  const activeStudentNormalized = getStudentNormalizedKey(
    studentClassInput,
    studentNameInput
  );
  const activeStudentDisplay = studentNameInput.trim() || 'Student';
  const activeClassDisplay = studentClassInput.trim() || '305';

  // All master records (both active and soft-deleted)
  const allMasterRecords = useMemo(
    () => buildStudentMasterRecords(quizHistory),
    [quizHistory]
  );

  // Split into Active vs Soft-Deleted records
  const activeMasterRecordsAllClasses = useMemo(
    () =>
      allMasterRecords.filter(
        (rec) => !deletedStudentKeys.includes(rec.normalizedKey)
      ),
    [allMasterRecords, deletedStudentKeys]
  );

  const deletedMasterRecords = useMemo(
    () =>
      allMasterRecords.filter((rec) =>
        deletedStudentKeys.includes(rec.normalizedKey)
      ),
    [allMasterRecords, deletedStudentKeys]
  );

  // Available classes derived strictly from classes that have attempted the quiz (e.g. 302, 303, 305)
  const availableClasses = useMemo(() => {
    const set = new Set<string>();
    allMasterRecords.forEach((r) => {
      if (r.studentClass && r.studentClass.trim()) {
        set.add(r.studentClass.trim());
      }
    });
    if (set.size === 0) {
      PRESET_CLASSES.forEach((c) => set.add(c));
    }
    return Array.from(set).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true })
    );
  }, [allMasterRecords]);

  // Filtered active master records by Class
  const visibleActiveRecords = useMemo(() => {
    if (classFilter === 'ALL') return activeMasterRecordsAllClasses;
    return activeMasterRecordsAllClasses.filter(
      (r) => r.studentClass.toLowerCase() === classFilter.toLowerCase()
    );
  }, [activeMasterRecordsAllClasses, classFilter]);

  // Filtered deleted master records by Class
  const visibleDeletedRecords = useMemo(() => {
    if (classFilter === 'ALL') return deletedMasterRecords;
    return deletedMasterRecords.filter(
      (r) => r.studentClass.toLowerCase() === classFilter.toLowerCase()
    );
  }, [deletedMasterRecords, classFilter]);

  // Active attempts log (excluding soft-deleted students)
  const visibleAttemptsLog = useMemo(() => {
    return quizHistory.filter((att) => {
      const key = getStudentNormalizedKey(att.studentClass, att.studentName);
      if (deletedStudentKeys.includes(key)) return false;
      if (
        classFilter !== 'ALL' &&
        (att.studentClass || '305').toLowerCase() !==
          classFilter.toLowerCase()
      ) {
        return false;
      }
      return true;
    });
  }, [quizHistory, deletedStudentKeys, classFilter]);

  // Filter attempts belonging to the currently active student (matched by class + name)
  const activeStudentHistory = useMemo(
    () =>
      quizHistory.filter(
        (h) =>
          getStudentNormalizedKey(h.studentClass, h.studentName) ===
          activeStudentNormalized
      ),
    [quizHistory, activeStudentNormalized]
  );

  const chapterQuestions = useMemo(
    () =>
      sessionQuestions.length > 0
        ? sessionQuestions
        : shuffleQuestionChoices(
            QUIZ_QUESTIONS.filter((q) => q.chapterId === selectedChapterId)
          ),
    [sessionQuestions, selectedChapterId]
  );

  const activeChapterMeta = useMemo(
    () => CHAPTERS.find((c) => c.id === selectedChapterId) || CHAPTERS[0],
    [selectedChapterId]
  );

  // Checkbox selection helpers for current view
  const currentListKeys = useMemo(() => {
    if (recordViewTab === 'deleted') {
      return visibleDeletedRecords.map((r) => r.normalizedKey);
    }
    return visibleActiveRecords.map((r) => r.normalizedKey);
  }, [recordViewTab, visibleActiveRecords, visibleDeletedRecords]);

  const areAllCurrentSelected =
    currentListKeys.length > 0 &&
    currentListKeys.every((k) => selectedKeys.includes(k));

  const handleToggleSelectAll = () => {
    if (areAllCurrentSelected) {
      setSelectedKeys((prev) =>
        prev.filter((k) => !currentListKeys.includes(k))
      );
    } else {
      setSelectedKeys((prev) =>
        Array.from(new Set([...prev, ...currentListKeys]))
      );
    }
  };

  const handleToggleRowCheckbox = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Bulk or single delete handler
  const handleDeleteSelected = () => {
    const keysToDelete = selectedKeys.filter((k) =>
      visibleActiveRecords.some((r) => r.normalizedKey === k)
    );
    if (keysToDelete.length === 0) return;
    onSoftDeleteStudents(keysToDelete);
    setSelectedKeys((prev) => prev.filter((k) => !keysToDelete.includes(k)));
    setStatusBanner(
      `Moved ${keysToDelete.length} student record(s) to the Deleted / Restore Bin.`
    );
  };

  const handleDeleteSingle = (key: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSoftDeleteStudents([key]);
    setSelectedKeys((prev) => prev.filter((k) => k !== key));
    setStatusBanner(
      `Moved "${name}" to the Deleted / Restore Bin. Click 'Restore' anytime to recover.`
    );
  };

  // Bulk or single restore handler
  const handleRestoreSelected = () => {
    const keysToRestore = selectedKeys.filter((k) =>
      visibleDeletedRecords.some((r) => r.normalizedKey === k)
    );
    if (keysToRestore.length === 0) return;
    onRestoreStudents(keysToRestore);
    setSelectedKeys((prev) => prev.filter((k) => !keysToRestore.includes(k)));
    setStatusBanner(
      `Restored ${keysToRestore.length} student record(s) back to the Active Registry.`
    );
  };

  const handleRestoreAllInOneClick = () => {
    const allDelKeys = visibleDeletedRecords.map((r) => r.normalizedKey);
    if (allDelKeys.length === 0) return;
    onRestoreStudents(allDelKeys);
    setSelectedKeys([]);
    setRecordViewTab('master');
    setStatusBanner(
      `Restored all ${allDelKeys.length} deleted student record(s) back to the Active Registry.`
    );
  };

  const handleRestoreSingle = (key: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onRestoreStudents([key]);
    setSelectedKeys((prev) => prev.filter((k) => k !== key));
    setStatusBanner(`Restored "${name}" back to the Active Registry.`);
  };

  const handlePermanentDeleteSingle = (
    key: string,
    name: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    onPermanentDeleteStudents([key]);
    setSelectedKeys((prev) => prev.filter((k) => k !== key));
    setStatusBanner(`Permanently removed "${name}" from storage.`);
  };

  // Excel & CSV download handlers (exports selected students if checkboxes are ticked, otherwise all visible active students)
  const recordsForExport = useMemo(() => {
    const tickedActive = visibleActiveRecords.filter((r) =>
      selectedKeys.includes(r.normalizedKey)
    );
    return tickedActive.length > 0 ? tickedActive : visibleActiveRecords;
  }, [visibleActiveRecords, selectedKeys]);

  const handleDownloadExcel = () => {
    const exportKeys = recordsForExport.map((r) => r.normalizedKey);
    const matchingAttempts = visibleAttemptsLog.filter((att) =>
      exportKeys.includes(
        getStudentNormalizedKey(att.studentClass, att.studentName)
      )
    );
    downloadStudentRecordsExcel(
      recordsForExport,
      matchingAttempts,
      classFilter === 'ALL' ? 'All_Classes' : classFilter
    );
    setStatusBanner(
      `Downloaded Excel (.xls) softcopy containing ${recordsForExport.length} student record(s).`
    );
  };

  const handleDownloadCsv = () => {
    downloadStudentRecordsCsv(
      recordsForExport,
      classFilter === 'ALL' ? 'All_Classes' : classFilter
    );
    setStatusBanner(
      `Downloaded CSV (.csv) softcopy containing ${recordsForExport.length} student record(s).`
    );
  };

  const handleDownloadPdfBulk = () => {
    if (recordsForExport.length === 0) return;
    downloadMultipleStudentsPdfReport(
      recordsForExport,
      visibleAttemptsLog,
      classFilter === 'ALL' ? 'All_Classes' : classFilter
    );
    setStatusBanner(
      `Downloaded PDF Report (.pdf) with questions, student answers, marks & wrong-answer feedback for ${recordsForExport.length} student(s).`
    );
  };

  const handleDownloadSingleStudentPdf = (
    rec: StudentMasterRecord,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    downloadSingleStudentPdfReport(rec, quizHistory);
    setStatusBanner(
      `Downloaded PDF Report (.pdf) for "${rec.studentName}" (${rec.studentClass}) with all questions, answers, marks & feedback.`
    );
  };

  const handleStartQuiz = (chapId: string) => {
    if (!studentNameInput.trim()) {
      setStudentNameInput('Daniel');
    }
    if (!studentClassInput.trim()) {
      setStudentClassInput('305');
    }
    const freshShuffledQuestions = shuffleQuestionChoices(
      QUIZ_QUESTIONS.filter((q) => q.chapterId === chapId)
    );
    setSelectedChapterId(chapId);
    setSessionQuestions(freshShuffledQuestions);
    setIsPlayingQuiz(true);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setSessionAnswers([]);
    setJustCompletedAttempt(null);
  };

  const currentQuestion = chapterQuestions[currentQIndex];

  const handleConfirmOption = () => {
    if (selectedOption === null || !currentQuestion) return;
    const isCorrect = selectedOption === currentQuestion.correctIndex;
    const chosenAnswerText = currentQuestion.options[selectedOption] || '';
    const correctAnswerText =
      currentQuestion.options[currentQuestion.correctIndex] || '';
    const skillMeta = WEAKNESS_SKILLS[currentQuestion.skillId];

    const wrongAnswerComment = !isCorrect
      ? currentQuestion.wrongDiagnosisMap[selectedOption] ||
        skillMeta.commonMistakeMs
      : 'Correct! Full 1 mark awarded.';

    const remedialFeedback = !isCorrect
      ? `${currentQuestion.explanationMs} | Cambridge IGCSE Remedy: ${skillMeta.remedyExplanationMs} (Model Example: ${skillMeta.workedExample})`
      : currentQuestion.explanationMs;

    setIsAnswerSubmitted(true);
    setSessionAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        questionNumber: currentQIndex + 1,
        paperRef: currentQuestion.paperRef,
        contextFormula: currentQuestion.contextFormula,
        questionText: currentQuestion.questionMs,
        chosenAnswerText,
        correctAnswerText,
        isCorrect,
        markAwarded: isCorrect ? 1 : 0,
        maxMark: 1,
        skillId: currentQuestion.skillId,
        skillTitle: skillMeta.titleMs,
        wrongAnswerComment,
        remedialFeedback,
      },
    ]);
  };

  const handleNextOrFinish = () => {
    if (currentQIndex < chapterQuestions.length - 1) {
      setCurrentQIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      const correctCount = sessionAnswers.filter((a) => a.isCorrect).length;
      const totalQuestions = chapterQuestions.length;
      const scorePercent = Math.round((correctCount / totalQuestions) * 100);

      const existingStudentChapAttempts = activeStudentHistory.filter(
        (h) => h.chapterId === selectedChapterId
      );
      const nextAttemptNumber = existingStudentChapAttempts.length + 1;

      const emptySkills: Record<WeaknessSkillId, { correct: number; total: number }> = {
        valensi_kumpulan: { correct: 0, total: 0 },
        logam_peralihan: { correct: 0, total: 0 },
        kurungan_poliatomik: { correct: 0, total: 0 },
        nisbah_ringkas: { correct: 0, total: 0 },
        stoikiometri_atom: { correct: 0, total: 0 },
        simbol_keadaan: { correct: 0, total: 0 },
        ion_pemerhati: { correct: 0, total: 0 },
        persamaan_ionik_bersih: { correct: 0, total: 0 },
      };

      sessionAnswers.forEach((ans) => {
        emptySkills[ans.skillId].total += 1;
        if (ans.isCorrect) {
          emptySkills[ans.skillId].correct += 1;
        }
      });

      const newRecord: QuizAttemptRecord = {
        id: `attempt-${Date.now()}`,
        studentName: activeStudentDisplay,
        studentClass: activeClassDisplay,
        chapterId: selectedChapterId,
        timestamp: new Date().toISOString(),
        dateLabel: `Attempt ${nextAttemptNumber}`,
        scorePercent,
        correctCount,
        totalQuestions,
        skillBreakdown: emptySkills,
        wrongQuestionIds: sessionAnswers
          .filter((a) => !a.isCorrect)
          .map((a) => a.questionId),
        questionResponses: sessionAnswers,
      };

      onSaveAttempt(newRecord);
      setJustCompletedAttempt(newRecord);
      setIsPlayingQuiz(false);
    }
  };

  // Per-chapter statistics for the active student
  const chapterStats = useMemo(() => {
    return CHAPTERS.map((chap) => {
      const attempts = activeStudentHistory.filter((h) => h.chapterId === chap.id);
      const latestScore =
        attempts.length > 0 ? attempts[attempts.length - 1].scorePercent : 0;
      const previousScore =
        attempts.length > 1 ? attempts[attempts.length - 2].scorePercent : null;
      const avgScore =
        attempts.length > 0
          ? Math.round(
              attempts.reduce((acc, cur) => acc + cur.scorePercent, 0) /
                attempts.length
            )
          : 0;
      return {
        ...chap,
        attempts,
        latestScore,
        previousScore,
        avgScore,
      };
    });
  }, [activeStudentHistory]);

  const selectedChapterAttempts = useMemo(
    () => activeStudentHistory.filter((h) => h.chapterId === selectedChapterId),
    [activeStudentHistory, selectedChapterId]
  );

  // Diagnose weaknesses for the active student
  const diagnosedWeaknesses = useMemo(() => {
    const totals: Record<WeaknessSkillId, { correct: number; total: number }> = {
      valensi_kumpulan: { correct: 0, total: 0 },
      logam_peralihan: { correct: 0, total: 0 },
      kurungan_poliatomik: { correct: 0, total: 0 },
      nisbah_ringkas: { correct: 0, total: 0 },
      stoikiometri_atom: { correct: 0, total: 0 },
      simbol_keadaan: { correct: 0, total: 0 },
      ion_pemerhati: { correct: 0, total: 0 },
      persamaan_ionik_bersih: { correct: 0, total: 0 },
    };

    const sourceAttempts =
      activeStudentHistory.length > 0 ? activeStudentHistory : visibleAttemptsLog;

    sourceAttempts.forEach((att) => {
      (Object.keys(totals) as WeaknessSkillId[]).forEach((sk) => {
        const entry = att.skillBreakdown[sk];
        if (entry) {
          totals[sk].correct += entry.correct;
          totals[sk].total += entry.total;
        }
      });
    });

    const list = (Object.keys(totals) as WeaknessSkillId[]).map((sk) => {
      const { correct, total } = totals[sk];
      const accuracy = total > 0 ? Math.round((correct / total) * 100) : 100;
      return {
        meta: WEAKNESS_SKILLS[sk],
        correct,
        total,
        mistakes: total - correct,
        accuracy,
      };
    });

    return list.sort((a, b) => a.accuracy - b.accuracy);
  }, [activeStudentHistory, visibleAttemptsLog]);

  const selectedActiveCount = selectedKeys.filter((k) =>
    visibleActiveRecords.some((r) => r.normalizedKey === k)
  ).length;

  const selectedDeletedCount = selectedKeys.filter((k) =>
    visibleDeletedRecords.some((r) => r.normalizedKey === k)
  ).length;

  return (
    <div className="space-y-8">
      {/* Top Header: Student Class & Name Registration Bar */}
      <div
        className={`p-6 rounded-xl border ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-1">
              Cambridge IGCSE Chemistry (0620) · Paper 2 & Paper 4 Past Paper Bank (40 Questions)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Past Paper Quizzes & Class Student Record Manager
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Student Class Selector / Input */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="student-class-input"
                className="text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap"
              >
                Class:
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                <input
                  id="student-class-input"
                  list="preset-classes-list"
                  type="text"
                  value={studentClassInput}
                  onChange={(e) => setStudentClassInput(e.target.value)}
                  placeholder="e.g. 305"
                  className={`pl-9 pr-3 py-2 text-sm font-medium rounded-lg border w-40 sm:w-44 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    isDark
                      ? 'bg-slate-950 border-slate-700 text-slate-100'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
                <datalist id="preset-classes-list">
                  {availableClasses.map((cls) => (
                    <option key={cls} value={cls} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Student Name Input */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="student-name-input"
                className="text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap"
              >
                Student Name:
              </label>
              <div className="relative">
                <UserCheck className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-sky-500" />
                <input
                  id="student-name-input"
                  type="text"
                  value={studentNameInput}
                  onChange={(e) => setStudentNameInput(e.target.value)}
                  placeholder="Enter student name..."
                  className={`pl-9 pr-3 py-2 text-sm font-medium rounded-lg border w-44 sm:w-52 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    isDark
                      ? 'bg-slate-950 border-slate-700 text-slate-100'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleStartQuiz(selectedChapterId)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>Start {activeChapterMeta.number} (10 Qs)</span>
            </button>
          </div>
        </div>

        {/* 4 Chapter Selector Cards (10 Questions Each) */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {chapterStats.map((ch) => {
            const isSelected = ch.id === selectedChapterId;
            const hasAttempts = ch.attempts.length > 0;
            const statusText = !hasAttempts
              ? '○ NOT ATTEMPTED'
              : ch.latestScore >= 80
              ? '● DISTINCTION'
              : ch.latestScore >= 60
              ? '◆ MERIT'
              : '▲ NEEDS REVISION';
            const statusColor = !hasAttempts
              ? 'text-slate-400'
              : ch.latestScore >= 80
              ? 'text-emerald-600 dark:text-emerald-400'
              : ch.latestScore >= 60
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-rose-600 dark:text-rose-400';

            return (
              <div
                key={ch.id}
                onClick={() => {
                  setSelectedChapterId(ch.id);
                  if (isPlayingQuiz) {
                    setSessionQuestions(
                      shuffleQuestionChoices(
                        QUIZ_QUESTIONS.filter((q) => q.chapterId === ch.id)
                      )
                    );
                    setCurrentQIndex(0);
                    setSelectedOption(null);
                    setIsAnswerSubmitted(false);
                    setSessionAnswers([]);
                  }
                }}
                className={`p-4 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-sky-500 bg-sky-500/10 ring-1 ring-sky-500'
                    : isDark
                    ? 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-sky-600 dark:text-sky-400">
                      {ch.number} · 10 Qs
                    </span>
                    <span className={`font-semibold ${statusColor}`}>
                      {statusText}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold leading-snug mb-1">
                    {ch.titleMs}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {ch.subtitleMs}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 tabular-nums">
                    {ch.attempts.length} {ch.attempts.length === 1 ? 'attempt' : 'attempts'}
                    {ch.previousScore !== null && ` (Prev: ${ch.previousScore}%)`}
                  </span>
                  <span className="chem-mono font-bold text-sm tabular-nums">
                    {hasAttempts ? `Revised: ${ch.latestScore}%` : '—'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Quiz Runner Stage (10 Past Paper 2 & Paper 4 Questions) */}
      {isPlayingQuiz && currentQuestion && (
        <div
          className={`p-6 rounded-xl border-2 border-sky-500 ${
            isDark ? 'bg-slate-900' : 'bg-white'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                CANDIDATE: {activeStudentDisplay.toUpperCase()} ({activeClassDisplay}) ·{' '}
                {activeChapterMeta.number}
              </div>
              {currentQuestion.paperRef && (
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Cambridge IGCSE Source: {currentQuestion.paperRef}
                </div>
              )}
            </div>
            <div className="text-xs font-mono font-semibold tabular-nums text-slate-500">
              Question {currentQIndex + 1} of {chapterQuestions.length}
            </div>
          </div>

          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden my-3">
            <div
              className="h-full bg-sky-500 transition-all duration-200"
              style={{
                width: `${((currentQIndex + 1) / chapterQuestions.length) * 100}%`,
              }}
            />
          </div>

          <div className="py-4 space-y-5">
            {currentQuestion.contextFormula && (
              <div
                className={`inline-block px-3.5 py-1.5 rounded-lg border text-sm chem-mono font-semibold ${
                  isDark
                    ? 'bg-slate-950 border-slate-800 text-sky-400'
                    : 'bg-slate-50 border-slate-200 text-sky-700'
                }`}
              >
                {currentQuestion.contextFormula}
              </div>
            )}

            <h2 className="text-lg sm:text-xl font-semibold leading-snug">
              {currentQuestion.questionMs}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQuestion.options.map((opt, idx) => {
                const isPicked = selectedOption === idx;
                const isRightOption = idx === currentQuestion.correctIndex;
                const optionLetter = String.fromCharCode(65 + idx);

                let btnStyle = isDark
                  ? 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100';

                if (isAnswerSubmitted) {
                  if (isRightOption) {
                    btnStyle =
                      'border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold';
                  } else if (isPicked && !isRightOption) {
                    btnStyle =
                      'border-rose-500 bg-rose-500/15 text-rose-700 dark:text-rose-300';
                  }
                } else if (isPicked) {
                  btnStyle = 'border-sky-500 bg-sky-500/15 ring-1 ring-sky-500';
                }

                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={isAnswerSubmitted}
                    onClick={() => setSelectedOption(idx)}
                    className={`p-4 rounded-lg border text-left text-sm transition-all cursor-pointer flex items-start justify-between gap-3 ${btnStyle}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="chem-mono font-bold text-xs px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 shrink-0 mt-0.5">
                        {optionLetter}
                      </span>
                      <span className="chem-mono leading-relaxed">{opt}</span>
                    </div>
                    {isAnswerSubmitted && isRightOption && (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                        ● CORRECT
                      </span>
                    )}
                    {isAnswerSubmitted && isPicked && !isRightOption && (
                      <span className="text-xs font-bold text-rose-600 dark:text-rose-400 shrink-0">
                        ▲ INCORRECT
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {isAnswerSubmitted && selectedOption !== null && (
              <div
                className={`p-4 rounded-lg border text-sm space-y-2 ${
                  selectedOption === currentQuestion.correctIndex
                    ? isDark
                      ? 'bg-emerald-950/30 border-emerald-800 text-emerald-200'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : isDark
                    ? 'bg-rose-950/30 border-rose-800 text-rose-200'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div className="font-semibold">
                  {selectedOption === currentQuestion.correctIndex
                    ? '● Correct! Cambridge IGCSE Examiner Explanation:'
                    : `▲ Examiner Error Diagnosis (${WEAKNESS_SKILLS[currentQuestion.skillId].titleMs}):`}
                </div>
                {selectedOption !== currentQuestion.correctIndex &&
                  currentQuestion.wrongDiagnosisMap[selectedOption] && (
                    <p className="text-xs font-medium">
                      Why option {String.fromCharCode(65 + selectedOption)} is incorrect:{' '}
                      {currentQuestion.wrongDiagnosisMap[selectedOption]}
                    </p>
                  )}
                <p className="text-xs leading-relaxed opacity-90">
                  {currentQuestion.explanationMs}
                </p>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsPlayingQuiz(false)}
                className="text-xs text-slate-500 hover:underline cursor-pointer"
              >
                Exit Quiz Session
              </button>

              {!isAnswerSubmitted ? (
                <button
                  type="button"
                  disabled={selectedOption === null}
                  onClick={handleConfirmOption}
                  className="px-5 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-500 disabled:opacity-40 rounded-lg transition-colors cursor-pointer"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextOrFinish}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer"
                >
                  <span>
                    {currentQIndex < chapterQuestions.length - 1
                      ? `Next Question (${currentQIndex + 2}/${chapterQuestions.length})`
                      : 'Complete & Revise Student Record'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Post-Quiz Immediate Summary Banner */}
      {justCompletedAttempt && !isPlayingQuiz && (
        <div
          className={`p-6 rounded-xl border ${
            isDark
              ? 'bg-emerald-950/25 border-emerald-800/70'
              : 'bg-emerald-50/80 border-emerald-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                ● STUDENT RECORD REVISED FOR {justCompletedAttempt.studentName.toUpperCase()} ({justCompletedAttempt.studentClass})
              </div>
              <h2 className="text-xl font-semibold">
                {activeChapterMeta.number} ({justCompletedAttempt.dateLabel}):{' '}
                <span className="chem-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {justCompletedAttempt.scorePercent}% ({justCompletedAttempt.correctCount}/
                  {justCompletedAttempt.totalQuestions} Correct)
                </span>
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                The record for <strong>{justCompletedAttempt.studentName}</strong> in class{' '}
                <strong>{justCompletedAttempt.studentClass}</strong> has been revised with this latest score.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  downloadSingleAttemptPdfReport(justCompletedAttempt);
                  setStatusBanner(
                    `Downloaded PDF Script & Wrong-Answer Feedback for ${justCompletedAttempt.studentName}.`
                  );
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-lg whitespace-nowrap cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Download PDF (Questions, Answers & Feedback)</span>
              </button>
              <button
                type="button"
                onClick={() => handleStartQuiz(selectedChapterId)}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg whitespace-nowrap cursor-pointer"
              >
                Retake Chapter to Revise Score Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Registry by Class & Name: Checkboxes, Bulk Delete/Restore, PDF & Excel Softcopy Export */}
      <div
        className={`p-6 rounded-xl border ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-sky-600 dark:text-sky-400 mb-1">
              <Users className="w-4 h-4" />
              <span>STUDENT RECORD MANAGER BY CLASS & NAME (SELECT, DELETE, RESTORE, PDF & EXCEL EXPORT)</span>
            </div>
            <h2 className="text-lg font-extrabold">
              Class & Student Score Registry
            </h2>
          </div>

          {/* PDF, Excel & CSV Softcopy Download Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPdfBulk}
              disabled={recordsForExport.length === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 disabled:opacity-40 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>
                Download PDF Questions, Answers & Feedback (.pdf)
                {selectedActiveCount > 0 ? ` (${selectedActiveCount} Selected)` : ''}
              </span>
            </button>

            <button
              type="button"
              onClick={handleDownloadExcel}
              disabled={recordsForExport.length === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>
                Download Excel (.xls Softcopy)
                {selectedActiveCount > 0 ? ` (${selectedActiveCount} Selected)` : ''}
              </span>
            </button>

            <button
              type="button"
              onClick={handleDownloadCsv}
              disabled={recordsForExport.length === 0}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border transition-colors whitespace-nowrap cursor-pointer disabled:opacity-40 ${
                isDark
                  ? 'bg-slate-950 border-slate-700 text-slate-200 hover:border-slate-600'
                  : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV (.csv)</span>
            </button>
          </div>
        </div>

        {/* Status Notification Banner for Delete / Restore / Export actions */}
        {statusBanner && (
          <div
            className={`mt-4 px-4 py-2.5 rounded-lg border text-xs font-medium flex items-center justify-between gap-2 ${
              isDark
                ? 'bg-sky-950/40 border-sky-800 text-sky-300'
                : 'bg-sky-50 border-sky-200 text-sky-800'
            }`}
          >
            <span>● {statusBanner}</span>
            <button
              type="button"
              onClick={() => setStatusBanner(null)}
              className="text-xs underline opacity-80 hover:opacity-100 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Filter & Bulk Action Toolbar */}
        <div className="mt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          {/* Left: View Switcher Tabs & Class Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <div
              className={`flex items-center gap-1 p-1 rounded-lg ${
                isDark ? 'bg-slate-950' : 'bg-slate-100'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setRecordViewTab('master');
                  setSelectedKeys([]);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  recordViewTab === 'master'
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Active Students ({visibleActiveRecords.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setRecordViewTab('deleted');
                  setSelectedKeys([]);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  recordViewTab === 'deleted'
                    ? 'bg-amber-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Deleted / Restore Bin ({visibleDeletedRecords.length})
              </button>
              <button
                type="button"
                onClick={() => setRecordViewTab('log')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  recordViewTab === 'log'
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All Attempts Log ({visibleAttemptsLog.length})
              </button>
            </div>

            {/* Class Filter Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                Filter Class:
              </span>
              <select
                value={classFilter}
                onChange={(e) => {
                  setClassFilter(e.target.value);
                  setSelectedKeys([]);
                }}
                className={`px-2.5 py-1.5 rounded-lg border font-medium ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-slate-200'
                    : 'bg-slate-50 border-slate-300 text-slate-800'
                }`}
              >
                <option value="ALL">All Classes</option>
                {availableClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right: 1-Click Select All, Delete Selected, and Restore Selected Controls */}
          {recordViewTab !== 'log' && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleToggleSelectAll}
                disabled={currentListKeys.length === 0}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap cursor-pointer disabled:opacity-40 ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-slate-200 hover:border-slate-600'
                    : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5 text-sky-500" />
                <span>
                  {areAllCurrentSelected
                    ? 'Deselect All in 1 Click'
                    : `Select All in 1 Click (${currentListKeys.length})`}
                </span>
              </button>

              {recordViewTab === 'master' && (
                <button
                  type="button"
                  onClick={handleDeleteSelected}
                  disabled={selectedActiveCount === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-40 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Selected ({selectedActiveCount})</span>
                </button>
              )}

              {recordViewTab === 'deleted' && (
                <>
                  <button
                    type="button"
                    onClick={handleRestoreSelected}
                    disabled={selectedDeletedCount === 0}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <ArchiveRestore className="w-3.5 h-3.5" />
                    <span>Restore Selected ({selectedDeletedCount})</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRestoreAllInOneClick}
                    disabled={visibleDeletedRecords.length === 0}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/10 disabled:opacity-40 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <ArchiveRestore className="w-3.5 h-3.5" />
                    <span>Restore All in 1 Click ({visibleDeletedRecords.length})</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Table Content based on active tab */}
        {recordViewTab === 'master' && (
          <div className="mt-3 overflow-x-auto">
            {visibleActiveRecords.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
                <div>No active student records found for this filter.</div>
                {deletedMasterRecords.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setRecordViewTab('deleted')}
                    className="text-sky-500 underline cursor-pointer"
                  >
                    View {deletedMasterRecords.length} record(s) in the Deleted / Restore Bin
                  </button>
                )}
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                    <th className="py-2.5 pr-3 w-8">
                      <input
                        type="checkbox"
                        checked={areAllCurrentSelected}
                        onChange={handleToggleSelectAll}
                        aria-label="Select all students"
                        className="w-4 h-4 rounded accent-sky-600 cursor-pointer"
                      />
                    </th>
                    <th className="py-2.5 px-3 font-medium">Class</th>
                    <th className="py-2.5 px-3 font-medium">Student Name</th>
                    <th className="py-2.5 px-3 font-medium text-right tabular-nums">
                      Ch 01 (Revised)
                    </th>
                    <th className="py-2.5 px-3 font-medium text-right tabular-nums">
                      Ch 02 (Revised)
                    </th>
                    <th className="py-2.5 px-3 font-medium text-right tabular-nums">
                      Ch 03 (Revised)
                    </th>
                    <th className="py-2.5 px-3 font-medium text-right tabular-nums">
                      Ch 04 (Revised)
                    </th>
                    <th className="py-2.5 px-3 font-medium text-right tabular-nums">
                      Attempts
                    </th>
                    <th className="py-2.5 px-3 font-medium text-right tabular-nums">
                      Overall Avg
                    </th>
                    <th className="py-2.5 pl-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {visibleActiveRecords.map((rec) => {
                    const isSelectedStudent =
                      rec.normalizedKey === activeStudentNormalized;
                    const isChecked = selectedKeys.includes(rec.normalizedKey);
                    return (
                      <tr
                        key={rec.normalizedKey}
                        onClick={() => {
                          setStudentNameInput(rec.studentName);
                          setStudentClassInput(rec.studentClass);
                        }}
                        className={`cursor-pointer transition-colors ${
                          isSelectedStudent
                            ? isDark
                              ? 'bg-sky-950/30'
                              : 'bg-sky-50/80'
                            : isDark
                            ? 'hover:bg-slate-950/60'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <td
                          className="py-3 pr-3"
                          onClick={(e) => handleToggleRowCheckbox(rec.normalizedKey, e)}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            aria-label={`Select ${rec.studentName}`}
                            className="w-4 h-4 rounded accent-sky-600 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3 font-medium text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                          {rec.studentClass}
                        </td>
                        <td className="py-3 px-3 font-semibold whitespace-nowrap">
                          <span>{rec.studentName}</span>
                          {isSelectedStudent && (
                            <span className="ml-2 text-[11px] font-medium text-sky-600 dark:text-sky-400">
                              · Active
                            </span>
                          )}
                        </td>
                        {['bab1', 'bab2', 'bab3', 'bab4'].map((cid) => {
                          const cRev = rec.chapters[cid];
                          if (!cRev) {
                            return (
                              <td
                                key={cid}
                                className="py-3 px-3 text-right chem-mono text-slate-400 tabular-nums"
                              >
                                —
                              </td>
                            );
                          }
                          return (
                            <td
                              key={cid}
                              className="py-3 px-3 text-right chem-mono tabular-nums"
                            >
                              <span className="font-bold text-slate-900 dark:text-slate-100">
                                {cRev.latestScorePercent}%
                              </span>
                              <span className="text-[11px] text-slate-500 ml-1">
                                ({cRev.latestCorrectCount}/{cRev.totalQuestions})
                              </span>
                              {cRev.previousScorePercent !== null && (
                                <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                                  Revised from {cRev.previousScorePercent}% ({cRev.attemptsCount}x)
                                </div>
                              )}
                            </td>
                          );
                        })}
                        <td className="py-3 px-3 text-right chem-mono tabular-nums">
                          {rec.totalAttempts}
                        </td>
                        <td className="py-3 px-3 text-right chem-mono font-bold text-sky-600 dark:text-sky-400 tabular-nums">
                          {rec.overallAverageLatest}%
                        </td>
                        <td className="py-3 pl-3 text-right whitespace-nowrap space-x-1.5">
                          <button
                            type="button"
                            onClick={(e) => handleDownloadSingleStudentPdf(rec, e)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-sky-600 dark:text-sky-400 hover:bg-sky-500/10 rounded border border-sky-500/30 transition-colors cursor-pointer"
                            title={`Download PDF Questions, Answers, Marks & Feedback for ${rec.studentName}`}
                          >
                            <FileText className="w-3 h-3" />
                            <span>PDF Report</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) =>
                              handleDeleteSingle(rec.normalizedKey, rec.studentName, e)
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded border border-rose-500/30 transition-colors cursor-pointer"
                            title={`Delete ${rec.studentName}`}
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {recordViewTab === 'deleted' && (
          <div className="mt-3 overflow-x-auto">
            {visibleDeletedRecords.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
                No deleted student records in the Restore Bin.
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                    <th className="py-2.5 pr-3 w-8">
                      <input
                        type="checkbox"
                        checked={areAllCurrentSelected}
                        onChange={handleToggleSelectAll}
                        aria-label="Select all deleted students"
                        className="w-4 h-4 rounded accent-sky-600 cursor-pointer"
                      />
                    </th>
                    <th className="py-2.5 px-3 font-medium">Class</th>
                    <th className="py-2.5 px-3 font-medium">Student Name</th>
                    <th className="py-2.5 px-3 font-medium text-right tabular-nums">
                      Total Attempts
                    </th>
                    <th className="py-2.5 px-3 font-medium text-right tabular-nums">
                      Overall Avg
                    </th>
                    <th className="py-2.5 pl-3 font-medium text-right">
                      Restore / Remove
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {visibleDeletedRecords.map((rec) => {
                    const isChecked = selectedKeys.includes(rec.normalizedKey);
                    return (
                      <tr
                        key={rec.normalizedKey}
                        onClick={(e) => handleToggleRowCheckbox(rec.normalizedKey, e)}
                        className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-950/60"
                      >
                        <td className="py-3 pr-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            aria-label={`Select deleted record ${rec.studentName}`}
                            className="w-4 h-4 rounded accent-sky-600 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-500">
                          {rec.studentClass}
                        </td>
                        <td className="py-3 px-3 font-semibold line-through text-slate-500">
                          {rec.studentName}
                        </td>
                        <td className="py-3 px-3 text-right chem-mono tabular-nums">
                          {rec.totalAttempts}
                        </td>
                        <td className="py-3 px-3 text-right chem-mono font-bold tabular-nums">
                          {rec.overallAverageLatest}%
                        </td>
                        <td className="py-3 pl-3 text-right whitespace-nowrap space-x-2">
                          <button
                            type="button"
                            onClick={(e) =>
                              handleRestoreSingle(rec.normalizedKey, rec.studentName, e)
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 rounded border border-emerald-500/30 transition-colors cursor-pointer"
                          >
                            <ArchiveRestore className="w-3 h-3" />
                            <span>Restore</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) =>
                              handlePermanentDeleteSingle(
                                rec.normalizedKey,
                                rec.studentName,
                                e
                              )
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded border border-rose-500/30 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Permanent Delete</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {recordViewTab === 'log' && (
          <div className="mt-3 overflow-x-auto max-h-72">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="py-2 pr-4 font-medium">Class</th>
                  <th className="py-2 px-3 font-medium">Student Name</th>
                  <th className="py-2 px-3 font-medium">Chapter</th>
                  <th className="py-2 px-3 font-medium">Attempt</th>
                  <th className="py-2 px-3 font-medium text-right tabular-nums">
                    Score (out of 10)
                  </th>
                  <th className="py-2 px-3 font-medium text-right tabular-nums">
                    Percentage
                  </th>
                  <th className="py-2 pl-3 font-medium text-right">
                    Question & Answer PDF
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {[...visibleAttemptsLog].reverse().map((att) => (
                  <tr key={att.id}>
                    <td className="py-2.5 pr-4 font-bold text-emerald-600 dark:text-emerald-400">
                      {att.studentClass || '305'}
                    </td>
                    <td className="py-2.5 px-3 font-semibold">{att.studentName}</td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {att.chapterId.replace('bab', 'Chapter 0')}
                    </td>
                    <td className="py-2.5 px-3 chem-mono">{att.dateLabel}</td>
                    <td className="py-2.5 px-3 text-right chem-mono tabular-nums">
                      {att.correctCount} / {att.totalQuestions}
                    </td>
                    <td className="py-2.5 px-3 text-right chem-mono font-bold text-sky-600 dark:text-sky-400 tabular-nums">
                      {att.scorePercent}%
                    </td>
                    <td className="py-2.5 pl-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          downloadSingleAttemptPdfReport(att);
                          setStatusBanner(
                            `Downloaded PDF Script & Feedback for ${att.studentName} (${att.chapterId.replace(
                              'bab',
                              'Chapter 0'
                            )}, ${att.dateLabel}).`
                          );
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-sky-600 dark:text-sky-400 hover:bg-sky-500/10 rounded border border-sky-500/30 transition-colors cursor-pointer"
                      >
                        <FileText className="w-3 h-3" />
                        <span>PDF Script</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Analytics Grid: Left 7 Cols Progress Charts, Right 5 Cols Specific Weakness Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Chapter Progression Line Chart & Multi-Chapter Comparison */}
        <div className="lg:col-span-7 space-y-6">
          <div
            className={`p-6 rounded-xl border ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-sky-600 dark:text-sky-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>
                    PROGRESSION GRAPH FOR {activeStudentDisplay.toUpperCase()} ({activeClassDisplay})
                  </span>
                </div>
                <h2 className="text-base font-semibold mt-0.5">
                  {activeChapterMeta.number}: {activeChapterMeta.titleMs}
                </h2>
              </div>

              <span className="text-xs chem-mono text-slate-500 tabular-nums">
                IGCSE Target: {activeChapterMeta.targetScore}%
              </span>
            </div>

            <div
              className={`my-4 p-4 rounded-lg border ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <svg
                viewBox="0 0 600 220"
                className="w-full h-auto"
                role="img"
                aria-label="Score Progression Line Chart"
              >
                {[
                  { pct: 100, y: 30, label: '100%' },
                  { pct: 80, y: 62, label: '80% (Target)' },
                  { pct: 50, y: 110, label: '50%' },
                  { pct: 0, y: 190, label: '0%' },
                ].map((grid) => (
                  <g key={grid.pct}>
                    <line
                      x1="65"
                      y1={grid.y}
                      x2="565"
                      y2={grid.y}
                      stroke={
                        grid.pct === 80
                          ? '#059669'
                          : isDark
                          ? '#1e293b'
                          : '#e2e8f0'
                      }
                      strokeWidth={grid.pct === 80 ? '1.5' : '1'}
                      strokeDasharray={grid.pct === 80 ? '5 4' : undefined}
                    />
                    <text
                      x="58"
                      y={grid.y + 4}
                      textAnchor="end"
                      fill={
                        grid.pct === 80
                          ? '#059669'
                          : isDark
                          ? '#94a3b8'
                          : '#64748b'
                      }
                      fontSize="10"
                      fontFamily="'Outfit', 'Plus Jakarta Sans', sans-serif"
                    >
                      {grid.label}
                    </text>
                  </g>
                ))}

                {selectedChapterAttempts.length === 0 ? (
                  <text
                    x="315"
                    y="115"
                    textAnchor="middle"
                    fill={isDark ? '#64748b' : '#94a3b8'}
                    fontSize="12"
                  >
                    No quiz attempts recorded for {activeStudentDisplay} in {activeChapterMeta.number} yet.
                  </text>
                ) : (
                  (() => {
                    const pts = selectedChapterAttempts.map((att, idx) => {
                      const count = selectedChapterAttempts.length;
                      const x =
                        count === 1
                          ? 315
                          : 100 + (idx / (count - 1)) * 430;
                      const y = 190 - (att.scorePercent / 100) * 160;
                      return { x, y, att };
                    });

                    const polylinePoints = pts.map((p) => `${p.x},${p.y}`).join(' ');

                    return (
                      <>
                        {pts.length > 1 && (
                          <polyline
                            fill="none"
                            stroke="#0284c7"
                            strokeWidth="3"
                            points={polylinePoints}
                          />
                        )}
                        {pts.map((p) => (
                          <g key={p.att.id}>
                            <circle
                              cx={p.x}
                              cy={p.y}
                              r="6"
                              fill={p.att.scorePercent >= 80 ? '#059669' : '#0284c7'}
                              stroke={isDark ? '#0f172a' : '#ffffff'}
                              strokeWidth="2"
                            />
                            <text
                              x={p.x}
                              y={p.y - 12}
                              textAnchor="middle"
                              fill={isDark ? '#f8fafc' : '#0f172a'}
                              fontSize="11"
                              fontWeight="700"
                              fontFamily="'Outfit', 'Plus Jakarta Sans', sans-serif"
                            >
                              {p.att.scorePercent}% ({p.att.correctCount}/10)
                            </text>
                            <text
                              x={p.x}
                              y="210"
                              textAnchor="middle"
                              fill={isDark ? '#94a3b8' : '#64748b'}
                              fontSize="10"
                              fontFamily="'Outfit', 'Plus Jakarta Sans', sans-serif"
                            >
                              {p.att.dateLabel}
                            </text>
                          </g>
                        ))}
                      </>
                    );
                  })()
                )}
              </svg>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>
                Each attempt by <strong>{activeStudentDisplay}</strong> ({activeClassDisplay}) revises their latest chapter score.
              </span>
              <button
                type="button"
                onClick={() => {
                  onResetHistory();
                  setSelectedKeys([]);
                  setStatusBanner('Reset all student records to default sample data.');
                }}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All Demo Records</span>
              </button>
            </div>
          </div>

          <div
            className={`p-6 rounded-xl border ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <h2 className="text-base font-semibold pb-3 border-b border-slate-200 dark:border-slate-800">
              Revised Chapter Mastery for {activeStudentDisplay} ({activeClassDisplay})
            </h2>

            <div className="mt-4 space-y-4">
              {chapterStats.map((ch) => (
                <div key={ch.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold">
                      {ch.number}: {ch.titleMs}
                    </span>
                    <div className="flex items-center gap-3 chem-mono tabular-nums">
                      {ch.previousScore !== null && (
                        <span className="text-slate-500">
                          Previous: {ch.previousScore}%
                        </span>
                      )}
                      <span className="font-bold text-sky-600 dark:text-sky-400">
                        Revised Latest: {ch.latestScore}%
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-full h-3 rounded-full overflow-hidden ${
                      isDark ? 'bg-slate-950' : 'bg-slate-100'
                    }`}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        ch.latestScore >= 80
                          ? 'bg-emerald-500'
                          : ch.latestScore >= 60
                          ? 'bg-sky-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.max(4, ch.latestScore)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Specific Weakness Diagnostic & Actionable Feedback */}
        <div className="lg:col-span-5 space-y-6">
          <div
            className={`p-6 rounded-xl border ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
                <Target className="w-4 h-4" />
                <span>CAMBRIDGE IGCSE DIAGNOSTIC FEEDBACK</span>
              </div>
              <h2 className="text-base font-semibold">
                Specific Weakness Analysis for {activeStudentDisplay}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Pinpoints specific syllabus misconceptions from your Paper 2 & Paper 4 quiz responses.
              </p>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800 mt-2">
              {diagnosedWeaknesses.slice(0, 4).map((item) => {
                const isWeak = item.accuracy < 80;
                const recCation =
                  CATIONS.find((c) => c.id === item.meta.recommendedCationId) ||
                  CATIONS[0];
                const recAnion =
                  ANIONS.find((a) => a.id === item.meta.recommendedAnionId) ||
                  ANIONS[0];

                return (
                  <div key={item.meta.id} className="py-4 first:pt-3 last:pb-0 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                        {item.meta.chapterId.replace('bab', 'CH 0')} · {item.meta.titleMs}
                      </span>
                      <span
                        className={`text-xs chem-mono font-bold tabular-nums ${
                          isWeak
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {isWeak
                          ? `▲ Accuracy: ${item.accuracy}%`
                          : `● Mastery: ${item.accuracy}%`}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      <strong className="text-slate-900 dark:text-slate-100">
                        Specific Misconception:
                      </strong>{' '}
                      {item.meta.commonMistakeMs}
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      <strong className="text-emerald-700 dark:text-emerald-400">
                        Cambridge IGCSE Remedy:
                      </strong>{' '}
                      {item.meta.remedyExplanationMs}
                    </div>

                    <div
                      className={`p-2.5 rounded border text-xs chem-mono ${
                        isDark
                          ? 'bg-slate-950 border-slate-800 text-slate-300'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      Model Answer: {item.meta.workedExample}
                    </div>

                    <div className="pt-1 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() =>
                          onPracticeWeaknessInBalancer(recCation, recAnion)
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>
                          Review {recCation.displayHtml} + {recAnion.displayHtml} in Balancer
                        </span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStartQuiz(item.meta.chapterId)}
                        className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                      >
                        Retake {item.meta.chapterId.replace('bab', 'Chapter 0')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
