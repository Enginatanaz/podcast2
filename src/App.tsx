import React, { useState, useEffect, useCallback } from 'react';
import {
  UserProgress,
  Podcast,
  Keyword,
  CEFRLevel,
  Category,
  UserAccount,
  ListeningSession,
  SessionSummaryData,
} from './types';
import { INITIAL_PODCASTS } from './data/podcasts';
import { StorageService } from './services/storageService';
import { apiService, UserFullData } from './services/apiService';
import { SessionService } from './services/sessionService';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { PodcastsLibraryScreen } from './components/PodcastsLibraryScreen';
import { WordsScreen } from './components/WordsScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { OnboardingModal } from './components/OnboardingModal';
import { PodcastDetailModal } from './components/PodcastDetailModal';
import { PodcastPlayer } from './components/PodcastPlayer';
import { LearnModeView } from './components/LearnModeView';
import { AISpeakingPartnerModal } from './components/AISpeakingPartnerModal';
import { PodcastQuizModal } from './components/PodcastQuizModal';
import { PodcastResultModal } from './components/PodcastResultModal';
import { GeneratePodcastModal } from './components/GeneratePodcastModal';
import { InteractiveWordPopover } from './components/InteractiveWordPopover';
import { UserSwitcherModal } from './components/UserSwitcherModal';
import { SmartSessionModal } from './components/SmartSessionModal';
import { SmartSessionPlayerModal } from './components/SmartSessionPlayerModal';
import { ValidationReportModal } from './components/ValidationReportModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserAccount>({
    id: 'user-b',
    username: 'sarah',
    displayName: 'Sarah (User B - New)',
    email: 'sarah@example.com',
    level: 'A1',
    createdAt: Date.now(),
  });

  const [allUsers, setAllUsers] = useState<UserAccount[]>([]);

  // Default clean state for fresh new user: 0% progress, 0 words, 0 streak
  const [userProgress, setUserProgress] = useState<UserProgress>({
    userId: 'user-b',
    level: 'A1',
    onboardingCompleted: false,
    isNewUser: true,
    streak: 0,
    lastActiveDate: new Date().toISOString().split('T')[0],
    dailyGoalCompleted: false,
    totalListeningSeconds: 0,
    completedPodcasts: {},
    inProgressPodcasts: {},
    speakingAttempts: 0,
    savedWords: [],
    darkTheme: apiService.getThemePreference(),
    playbackSpeed: 0.75,
    overallProgress: 0,
  });

  const [podcasts, setPodcasts] = useState<Podcast[]>(() => {
    const custom = StorageService.getCustomPodcasts();
    return [...custom, ...INITIAL_PODCASTS];
  });

  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState(false);

  // Active Podcast flow
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
  const [activeViewMode, setActiveViewMode] = useState<'detail' | 'learn' | 'player' | null>(null);

  // Smart Listening Session state
  const [isSmartSessionModalOpen, setIsSmartSessionModalOpen] = useState(false);
  const [activeListeningSession, setActiveListeningSession] = useState<ListeningSession | null>(null);

  // Validation report inspection modal
  const [validationReportPodcast, setValidationReportPodcast] = useState<Podcast | null>(null);

  // Modals
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isSpeakingPartnerOpen, setIsSpeakingPartnerOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [currentQuizScore, setCurrentQuizScore] = useState<number>(85);
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);

  // Word popover
  const [activeWordPopover, setActiveWordPopover] = useState<{
    keyword: Keyword;
    podcastTitle: string;
    podcastId: string;
  } | null>(null);

  // Load server-side user data on mount
  const loadUserData = useCallback(async () => {
    const [fullData, users] = await Promise.all([
      apiService.fetchCurrentUserData(),
      apiService.fetchUsers(),
    ]);

    if (users.length > 0) {
      setAllUsers(users);
    }

    if (fullData) {
      setCurrentUser(fullData.user);
      setUserProgress(fullData.progress);
      if (!fullData.progress.onboardingCompleted) {
        setShowOnboarding(true);
      }
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Sync dark theme class on document element
  useEffect(() => {
    if (userProgress.darkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    apiService.setThemePreference(userProgress.darkTheme);
  }, [userProgress.darkTheme]);

  const handleToggleTheme = () => {
    const nextDark = !userProgress.darkTheme;
    setUserProgress((prev) => ({ ...prev, darkTheme: nextDark }));
  };

  // User Switching & Account Creation
  const handleSelectUser = async (userId: string) => {
    const data = await apiService.login(userId);
    if (data) {
      setCurrentUser(data.user);
      setUserProgress(data.progress);
      setIsUserSwitcherOpen(false);
      setActiveViewMode(null);
      setActiveListeningSession(null);
      setCurrentTab('home');

      if (!data.progress.onboardingCompleted) {
        setShowOnboarding(true);
      } else {
        setShowOnboarding(false);
      }
    }
  };

  const handleCreateUser = async (
    username: string,
    displayName: string,
    email: string,
    level: CEFRLevel
  ) => {
    const data = await apiService.register(username, displayName, email, level);
    if (data) {
      setCurrentUser(data.user);
      setUserProgress(data.progress);
      setIsUserSwitcherOpen(false);
      setActiveViewMode(null);
      setActiveListeningSession(null);
      setCurrentTab('home');

      // Refresh users list
      const users = await apiService.fetchUsers();
      setAllUsers(users);

      setShowOnboarding(!data.progress.onboardingCompleted);
    }
  };

  // Onboarding completion (strictly isolated per user on server)
  const handleCompleteOnboarding = async (level: CEFRLevel) => {
    setShowOnboarding(false);
    const updated = await apiService.updateOnboarding(level);
    if (updated) {
      setUserProgress(updated.progress);
    } else {
      setUserProgress((prev) => ({
        ...prev,
        level,
        onboardingCompleted: true,
        isNewUser: false,
        overallProgress: 0,
      }));
    }
  };

  // Changing CEFR level from UI
  const handleChangeLevel = async (level: CEFRLevel) => {
    await apiService.updateLevel(level);
    setUserProgress((prev) => ({ ...prev, level }));
  };

  // Navigation into a Podcast
  const handleSelectPodcast = (podcast: Podcast, mode: 'learn' | 'player' = 'player') => {
    setSelectedPodcast(podcast);
    setActiveViewMode(mode);
  };

  const handleStartLearning = (podcast: Podcast) => {
    setSelectedPodcast(podcast);
    setActiveViewMode('learn');
  };

  const handleStartListening = (podcast: Podcast) => {
    setSelectedPodcast(podcast);
    setActiveViewMode('player');
  };

  const handleCloseActiveView = () => {
    setActiveViewMode(null);
  };

  // Smart Listening Session Handlers
  const handleOpenSmartSession = (_presetMinutes?: number) => {
    setIsSmartSessionModalOpen(true);
  };

  const handleStartSession = (session: ListeningSession) => {
    setIsSmartSessionModalOpen(false);
    setActiveListeningSession(session);
  };

  const handleFinishSession = async (summary: SessionSummaryData) => {
    // Record listening time and update progress for completed podcasts
    for (const p of summary.podcastsCompleted) {
      const completionRecord = {
        podcastId: p.id,
        podcastTitle: p.title,
        completedAt: Date.now(),
        listeningScore: 92,
        vocabularyScore: 88,
        quizScore: summary.quizScoreAverage,
        speakingScore: 85,
        overallScore: 90,
        status: 'mastered' as const,
        listeningTimeSeconds: p.durationSeconds || p.duration * 60,
      };
      await apiService.completePodcast(completionRecord);
    }

    // Refresh user data from server
    await loadUserData();
    setActiveListeningSession(null);
    setCurrentTab('progress');
  };

  // Validation report inspection
  const handleViewValidation = (podcast: Podcast) => {
    setValidationReportPodcast(podcast);
  };

  // Word popover & Vocabulary notebook (strictly user-scoped on server)
  const handleOpenWordPopover = (keyword: Keyword, podcastTitle?: string) => {
    setActiveWordPopover({
      keyword,
      podcastTitle: podcastTitle || selectedPodcast?.title || 'Daily English',
      podcastId: selectedPodcast?.id || 'general',
    });
  };

  const handleSaveWord = async (keyword: Keyword) => {
    const saved = await apiService.saveWord(
      keyword.word,
      keyword.meaning,
      keyword.example,
      selectedPodcast?.id || 'general',
      selectedPodcast?.title || 'Daily English'
    );

    if (saved) {
      setUserProgress((prev) => ({
        ...prev,
        savedWords: [saved, ...prev.savedWords.filter((w) => w.id !== saved.id)],
      }));
    }
  };

  const handleRemoveWord = async (wordId: string) => {
    const ok = await apiService.removeWord(wordId);
    if (ok) {
      setUserProgress((prev) => ({
        ...prev,
        savedWords: prev.savedWords.filter((w) => w.id !== wordId),
      }));
    }
  };

  const handleReviewWordResult = async (wordId: string, known: boolean) => {
    const updated = await apiService.reviewWord(wordId, known);
    if (updated) {
      setUserProgress((prev) => ({
        ...prev,
        savedWords: prev.savedWords.map((w) => (w.id === wordId ? updated : w)),
      }));
    }
  };

  // Tracking sentence progress (strictly user-scoped on server)
  const handleSentenceProgress = async (sentenceIndex: number, total: number) => {
    if (!selectedPodcast) return;
    await apiService.updateInProgress(
      selectedPodcast.id,
      selectedPodcast.title,
      sentenceIndex,
      total
    );

    const percent = Math.min(100, Math.round(((sentenceIndex + 1) / total) * 100));
    setUserProgress((prev) => ({
      ...prev,
      inProgressPodcasts: {
        ...prev.inProgressPodcasts,
        [selectedPodcast.id]: {
          podcastId: selectedPodcast.id,
          sentenceIndex,
          totalSentences: total,
          progressPercent: percent,
          lastListenedAt: Date.now(),
        },
      },
    }));
  };

  // Quiz completion & Mastered calculation (strictly user-scoped)
  const handleFinishQuiz = async (scorePercent: number) => {
    setCurrentQuizScore(scorePercent);
    setIsQuizOpen(false);

    if (selectedPodcast) {
      const completionRecord = {
        podcastId: selectedPodcast.id,
        podcastTitle: selectedPodcast.title,
        completedAt: Date.now(),
        listeningScore: 90,
        vocabularyScore: 85,
        quizScore: scorePercent,
        speakingScore: 80,
        overallScore: Math.round(scorePercent * 0.4 + 90 * 0.25 + 85 * 0.2 + 80 * 0.15),
        status: (scorePercent >= 80 ? 'mastered' : scorePercent >= 60 ? 'review' : 'practice_again') as
          | 'mastered'
          | 'review'
          | 'practice_again',
        listeningTimeSeconds: selectedPodcast.duration * 60,
      };

      const updated = await apiService.completePodcast(completionRecord);
      if (updated) {
        setUserProgress(updated.progress);
      }
    }

    setIsResultOpen(true);
  };

  const handlePodcastGenerated = (newPodcast: Podcast) => {
    StorageService.saveCustomPodcast(newPodcast);
    setPodcasts((prev) => [newPodcast, ...prev.filter((p) => p.id !== newPodcast.id)]);
    setIsAIGeneratorOpen(false);
    handleSelectPodcast(newPodcast, 'learn');
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      {/* Center wrapper for mobile-first app experience */}
      <div className="max-w-md mx-auto min-h-screen flex flex-col relative shadow-2xl bg-white dark:bg-stone-900 border-x border-stone-200/60 dark:border-stone-800/60">
        {/* Onboarding Dialog */}
        {showOnboarding && <OnboardingModal onComplete={handleCompleteOnboarding} />}

        {/* Global Active Learn Mode or Player Mode replaces home view */}
        {activeViewMode === 'learn' && selectedPodcast ? (
          <LearnModeView
            podcast={selectedPodcast}
            onBack={handleCloseActiveView}
            onOpenWordPopover={handleOpenWordPopover}
            onSentenceComplete={handleSentenceProgress}
            onFinishLearnMode={() => {
              setIsSpeakingPartnerOpen(true);
            }}
          />
        ) : activeViewMode === 'player' && selectedPodcast ? (
          <PodcastPlayer
            podcast={selectedPodcast}
            onBack={handleCloseActiveView}
            onSwitchToLearnMode={() => setActiveViewMode('learn')}
            onOpenWordPopover={handleOpenWordPopover}
            onOpenQuiz={() => setIsQuizOpen(true)}
            onOpenSpeakingPartner={() => setIsSpeakingPartnerOpen(true)}
            onSentenceCompleteProgress={handleSentenceProgress}
            onViewValidation={handleViewValidation}
          />
        ) : (
          /* Normal Tabbed Views */
          <>
            {/* Header */}
            <Header
              currentUser={currentUser}
              level={userProgress.level}
              streak={userProgress.streak}
              isDark={userProgress.darkTheme}
              onToggleTheme={handleToggleTheme}
              onChangeLevel={handleChangeLevel}
              onOpenUserSwitcher={() => setIsUserSwitcherOpen(true)}
            />

            {/* Tab Body */}
            <main className="flex-1 px-4 pt-2">
              {currentTab === 'home' && (
                <HomeScreen
                  podcasts={podcasts}
                  userProgress={userProgress}
                  onSelectPodcast={handleSelectPodcast}
                  onOpenAIGenerator={() => setIsAIGeneratorOpen(true)}
                  onExploreCategory={() => {
                    setCurrentTab('podcasts');
                  }}
                  onOpenSmartSession={handleOpenSmartSession}
                  onViewValidation={handleViewValidation}
                />
              )}

              {currentTab === 'podcasts' && (
                <PodcastsLibraryScreen
                  podcasts={podcasts}
                  userProgress={userProgress}
                  onSelectPodcast={handleSelectPodcast}
                  onOpenAIGenerator={() => setIsAIGeneratorOpen(true)}
                  onViewValidation={handleViewValidation}
                />
              )}

              {currentTab === 'words' && (
                <WordsScreen
                  savedWords={userProgress.savedWords}
                  onRemoveWord={handleRemoveWord}
                  onReviewWordResult={handleReviewWordResult}
                />
              )}

              {currentTab === 'progress' && (
                <ProgressScreen
                  userProgress={userProgress}
                  podcasts={podcasts}
                  onSelectPodcast={handleSelectPodcast}
                />
              )}

              {currentTab === 'profile' && (
                <ProfileScreen
                  currentUser={currentUser}
                  userProgress={userProgress}
                  isDark={userProgress.darkTheme}
                  onToggleTheme={handleToggleTheme}
                  onChangeLevel={handleChangeLevel}
                  onRetakeDiagnostic={() => setShowOnboarding(true)}
                  onOpenUserSwitcher={() => setIsUserSwitcherOpen(true)}
                />
              )}
            </main>

            {/* Bottom Nav */}
            <BottomNav
              currentTab={currentTab}
              onChangeTab={setCurrentTab}
              savedWordsCount={userProgress.savedWords.length}
            />
          </>
        )}

        {/* Modal: Podcast Detail */}
        {activeViewMode === 'detail' && selectedPodcast && (
          <PodcastDetailModal
            podcast={selectedPodcast}
            onClose={handleCloseActiveView}
            onStartLearning={handleStartLearning}
            onStartListening={handleStartListening}
            onWordClick={(kw, title) => handleOpenWordPopover(kw, title)}
            onViewValidation={handleViewValidation}
          />
        )}

        {/* Modal: Interactive Word Popover */}
        {activeWordPopover && (
          <InteractiveWordPopover
            keyword={activeWordPopover.keyword}
            podcastId={activeWordPopover.podcastId}
            podcastTitle={activeWordPopover.podcastTitle}
            isSaved={userProgress.savedWords.some(
              (w) => w.word.toLowerCase() === activeWordPopover.keyword.word.toLowerCase()
            )}
            onSave={handleSaveWord}
            onClose={() => setActiveWordPopover(null)}
            position={{ top: 0, left: 0 }}
          />
        )}

        {/* Modal: AI Speaking Partner */}
        {isSpeakingPartnerOpen && selectedPodcast && (
          <AISpeakingPartnerModal
            podcast={selectedPodcast}
            onClose={() => setIsSpeakingPartnerOpen(false)}
            onProceedToQuiz={() => {
              setIsSpeakingPartnerOpen(false);
              setIsQuizOpen(true);
            }}
          />
        )}

        {/* Modal: Quick Check Quiz */}
        {isQuizOpen && selectedPodcast && (
          <PodcastQuizModal
            podcast={selectedPodcast}
            onClose={() => setIsQuizOpen(false)}
            onFinishQuiz={handleFinishQuiz}
          />
        )}

        {/* Modal: Results & Mastered System */}
        {isResultOpen && selectedPodcast && (
          <PodcastResultModal
            podcast={selectedPodcast}
            quizScore={currentQuizScore}
            onClose={() => setIsResultOpen(false)}
            onGoHome={() => {
              setIsResultOpen(false);
              setActiveViewMode(null);
              setCurrentTab('home');
            }}
            onReplayPodcast={() => {
              setIsResultOpen(false);
              setActiveViewMode('learn');
            }}
          />
        )}

        {/* Modal: AI Podcast Generator with 7-Step Validation Pipeline */}
        {isAIGeneratorOpen && (
          <GeneratePodcastModal
            currentLevel={userProgress.level}
            onClose={() => setIsAIGeneratorOpen(false)}
            onPodcastGenerated={handlePodcastGenerated}
          />
        )}

        {/* Modal: Smart Listening Session Setup */}
        {isSmartSessionModalOpen && (
          <SmartSessionModal
            onClose={() => setIsSmartSessionModalOpen(false)}
            podcasts={podcasts}
            userLevel={userProgress.level}
            onStartSession={handleStartSession}
          />
        )}

        {/* Modal: Active Smart Session Player Coordinator */}
        {activeListeningSession && (
          <SmartSessionPlayerModal
            session={activeListeningSession}
            onClose={() => setActiveListeningSession(null)}
            onFinishSession={handleFinishSession}
            onSaveWord={(kw, title, pid) => {
              apiService.saveWord(kw.word, kw.meaning, kw.example, pid, title).then((saved) => {
                if (saved) {
                  setUserProgress((prev) => ({
                    ...prev,
                    savedWords: [saved, ...prev.savedWords.filter((w) => w.id !== saved.id)],
                  }));
                }
              });
            }}
            savedWords={userProgress.savedWords}
          />
        )}

        {/* Modal: Content Validation Audit Report */}
        {validationReportPodcast && (
          <ValidationReportModal
            podcast={validationReportPodcast}
            onClose={() => setValidationReportPodcast(null)}
          />
        )}

        {/* Modal: User Accounts Switcher (Strict User Isolation) */}
        {isUserSwitcherOpen && (
          <UserSwitcherModal
            currentUser={currentUser}
            allUsers={allUsers}
            onSelectUser={handleSelectUser}
            onCreateUser={handleCreateUser}
            onClose={() => setIsUserSwitcherOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
