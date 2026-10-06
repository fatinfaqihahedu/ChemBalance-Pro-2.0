/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  CATIONS,
  ANIONS,
  IonItem,
  INITIAL_QUIZ_HISTORY,
  QuizAttemptRecord,
  getStudentNormalizedKey,
} from './data/chemistryData';
import { IonBalancerView } from './components/IonBalancerView';
import { ReactionExplorerView } from './components/ReactionExplorerView';
import { InteractiveSimView } from './components/InteractiveSimView';
import { QuizAndAnalyticsView } from './components/QuizAndAnalyticsView';
import { Moon, Sun } from 'lucide-react';

type ActiveTab = 'balancer' | 'reactions' | 'simulation' | 'quiz';

const STORAGE_KEY_HISTORY = 'chembalance_pro_2_student_records_v7';
const STORAGE_KEY_DELETED_KEYS = 'chembalance_pro_2_deleted_students_v7';
const STORAGE_KEY_THEME = 'chembalance_pro_2_dark_mode_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('balancer');
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [selectedCation, setSelectedCation] = useState<IonItem>(
    CATIONS.find((c) => c.id === 'al') || CATIONS[0]
  );
  const [selectedAnion, setSelectedAnion] = useState<IonItem>(
    ANIONS.find((a) => a.id === 'so4') || ANIONS[0]
  );

  const [quizHistory, setQuizHistory] = useState<QuizAttemptRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_QUIZ_HISTORY;
  });

  const [deletedStudentKeys, setDeletedStudentKeys] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DELETED_KEYS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_THEME, JSON.stringify(isDark));
    } catch {
      // ignore
    }
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleSaveQuizAttempt = (attempt: QuizAttemptRecord) => {
    const normalizedStudent = getStudentNormalizedKey(
      attempt.studentClass,
      attempt.studentName
    );

    // If a previously deleted student takes a new quiz, automatically restore them to active
    if (deletedStudentKeys.includes(normalizedStudent)) {
      setDeletedStudentKeys((prev) => {
        const next = prev.filter((k) => k !== normalizedStudent);
        try {
          localStorage.setItem(STORAGE_KEY_DELETED_KEYS, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    }

    setQuizHistory((prev) => {
      const updated = [...prev, attempt];
      try {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleSoftDeleteStudents = (keysToDelete: string[]) => {
    setDeletedStudentKeys((prev) => {
      const next = Array.from(new Set([...prev, ...keysToDelete]));
      try {
        localStorage.setItem(STORAGE_KEY_DELETED_KEYS, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleRestoreStudents = (keysToRestore: string[]) => {
    setDeletedStudentKeys((prev) => {
      const next = prev.filter((k) => !keysToRestore.includes(k));
      try {
        localStorage.setItem(STORAGE_KEY_DELETED_KEYS, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handlePermanentDeleteStudents = (keysToRemove: string[]) => {
    setDeletedStudentKeys((prev) => {
      const next = prev.filter((k) => !keysToRemove.includes(k));
      try {
        localStorage.setItem(STORAGE_KEY_DELETED_KEYS, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    setQuizHistory((prev) => {
      const updated = prev.filter(
        (att) =>
          !keysToRemove.includes(
            getStudentNormalizedKey(att.studentClass, att.studentName)
          )
      );
      try {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleResetQuizHistory = () => {
    setQuizHistory(INITIAL_QUIZ_HISTORY);
    setDeletedStudentKeys([]);
    try {
      localStorage.setItem(
        STORAGE_KEY_HISTORY,
        JSON.stringify(INITIAL_QUIZ_HISTORY)
      );
      localStorage.setItem(STORAGE_KEY_DELETED_KEYS, JSON.stringify([]));
    } catch {
      // ignore
    }
  };

  const handleOpenInSimulation = (cation: IonItem, anion: IonItem) => {
    setSelectedCation(cation);
    setSelectedAnion(anion);
    setActiveTab('simulation');
  };

  const handlePracticeWeaknessInBalancer = (cation: IonItem, anion: IonItem) => {
    setSelectedCation(cation);
    setSelectedAnion(anion);
    setActiveTab('balancer');
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDark
          ? 'bg-[#0F172A] text-slate-100 tracking-[0.005em]'
          : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      {/* Top Bar Contract: Strictly 1 row, 3 zones */}
      <header
        className={`sticky top-0 z-30 border-b transition-colors ${
          isDark
            ? 'bg-[#0F172A]/95 border-slate-800 backdrop-blur-md'
            : 'bg-white/95 border-slate-200 backdrop-blur-md'
        }`}
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('balancer');
            }}
            className="text-xl sm:text-2xl font-extrabold font-serif-display tracking-tight whitespace-nowrap shrink-0 text-sky-600 dark:text-sky-400"
          >
            ChemBalance Pro 2.0
          </a>

          {/* Zone 2: 4 clean text navigation links */}
          <nav className="flex items-center gap-4 sm:gap-7 text-xs sm:text-sm font-bold overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('balancer')}
              className={`py-1 whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'balancer'
                  ? 'border-sky-500 text-sky-600 dark:text-sky-400 font-extrabold'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Ion Balancer
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reactions')}
              className={`py-1 whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'reactions'
                  ? 'border-sky-500 text-sky-600 dark:text-sky-400 font-extrabold'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Chemical Reactions
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('simulation')}
              className={`py-1 whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'simulation'
                  ? 'border-sky-500 text-sky-600 dark:text-sky-400 font-extrabold'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Lab Simulation
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('quiz')}
              className={`py-1 whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'quiz'
                  ? 'border-sky-500 text-sky-600 dark:text-sky-400 font-extrabold'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Quiz & Progress
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions (Eye-comfort Dark Mode Toggle) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
              aria-label={isDark ? 'Switch to Day Mode' : 'Switch to Night Study Mode'}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700'
                  : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
              }`}
            >
              {isDark ? (
                <>
                  <Moon className="w-3.5 h-3.5" />
                  <span>Night Mode On</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Day Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'balancer' && (
          <IonBalancerView
            selectedCation={selectedCation}
            selectedAnion={selectedAnion}
            onSelectCation={setSelectedCation}
            onSelectAnion={setSelectedAnion}
            onOpenInSimulation={handleOpenInSimulation}
            isDark={isDark}
          />
        )}

        {activeTab === 'reactions' && <ReactionExplorerView isDark={isDark} />}

        {activeTab === 'simulation' && (
          <InteractiveSimView
            cation={selectedCation}
            anion={selectedAnion}
            onSelectCation={setSelectedCation}
            onSelectAnion={setSelectedAnion}
            isDark={isDark}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizAndAnalyticsView
            quizHistory={quizHistory}
            deletedStudentKeys={deletedStudentKeys}
            onSaveAttempt={handleSaveQuizAttempt}
            onSoftDeleteStudents={handleSoftDeleteStudents}
            onRestoreStudents={handleRestoreStudents}
            onPermanentDeleteStudents={handlePermanentDeleteStudents}
            onResetHistory={handleResetQuizHistory}
            onPracticeWeaknessInBalancer={handlePracticeWeaknessInBalancer}
            isDark={isDark}
          />
        )}
      </main>

      {/* Quiet Academic Footer */}
      <footer
        className={`mt-12 border-t py-6 text-xs ${
          isDark
            ? 'border-slate-800 text-slate-500'
            : 'border-slate-200 text-slate-500'
        }`}
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            ChemBalance Pro 2.0 · Cambridge IGCSE Chemistry (0620) Student's Book Interactive Module
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('balancer')}
              className="hover:underline cursor-pointer"
            >
              Formula Balancer
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setActiveTab('simulation')}
              className="hover:underline cursor-pointer"
            >
              Electrostatic Simulation
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setActiveTab('quiz')}
              className="hover:underline cursor-pointer"
            >
              Quiz Analytics & Excel Export
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
