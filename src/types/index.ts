export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2';

export type Category =
  | 'Daily Life'
  | 'Real Life'
  | 'Work'
  | 'Interests'
  | 'Food'
  | 'Travel'
  | 'Social'
  | 'Real Conversations';

export type TopicGroup =
  | 'Daily Life'
  | 'Food'
  | 'Travel'
  | 'Work'
  | 'Social Life'
  | 'Entertainment'
  | 'Modern Life'
  | 'General';

export type ContentType =
  | 'Daily Conversation'
  | 'Dialogue'
  | 'Conversation'
  | 'Short Story'
  | 'Personal Story'
  | 'Interview'
  | 'Mini News'
  | 'Real-Life Scenario'
  | 'Problem & Solution'
  | 'Question & Answer'
  | 'Storytelling'
  | 'Travel Story'
  | 'Workplace Conversation'
  | 'Opinion'
  | 'Experience'
  | 'Listening Challenge'
  | 'Slow English'
  | 'Normal English'
  | 'Shadowing'
  | 'Dictation'
  | 'Vocabulary Story'
  | 'Grammar Story'
  | 'Conversation Challenge';

export type ContentFormat = ContentType;

export type ListeningChallengeType =
  | 'Dictation'
  | 'Missing Words'
  | 'True / False'
  | 'Main Idea'
  | 'Detail Listening'
  | 'Conversation Challenge';

export type PodcastType =
  | 'dialogue'
  | 'story'
  | 'daily_life'
  | 'interview'
  | 'travel'
  | 'situation'
  | 'mini_story'
  | 'personal_experience';

export type ListeningMode = 'easy' | 'normal' | 'challenge';

// Validation Pipeline & Content Quality Score (7 pillars)
export interface ContentValidationReport {
  version: number; // e.g. 1 (Draft), 2 (Validated), 3 (Published)
  status: 'draft' | 'validating' | 'validated' | 'rejected' | 'published';
  grammarScore: number; // 0 - 100 (min 90 for publish, 0 critical errors)
  naturalnessScore: number; // 0 - 100
  cefrScore: number; // 0 - 100
  vocabularyScore: number; // 0 - 100
  translationScore: number; // 0 - 100
  pronunciationAccuracy: number; // 0 - 100 (min 95 required for publish, strict phoneme & stress accuracy)
  educationalScore?: number; // 0 - 100
  originalityScore?: number; // 0 - 100
  overallScore: number; // 0 - 100 (weighted avg)
  grammarChecks: {
    passed: boolean;
    issues: string[];
    correctedCount: number;
    tenseCorrect: boolean;
    subjectVerbAgreement: boolean;
    articlesAndPrepositions: boolean;
    wordOrder: boolean;
  };
  phoneticModelChecks?: {
    passed: boolean;
    thSoundVerified: boolean; // /θ/ and /ð/ correctly modeled
    vowelClarityVerified: boolean; // pure vowels and diphthongs distinct
    stressAndRhythmVerified: boolean; // natural syllable stress without hyper-syllabification
    noTurkifiedSounds: boolean; // zero Turkish phonetic interference (e.g. /w/ vs /v/, missing schwa)
    appropriatePacing: boolean; // clear articulate pace without robotic distortion
  };
  cefrAppropriate: boolean;
  cefrFeedback: string;
  naturalnessFeedback: string;
  translationFeedback: string;
  pronunciationFeedback?: string;
  teacherVerdict: 'YES' | 'NO'; // "Would I give this podcast to an English learner?"
  teacherComment: string;
  validationTimestamp: number;
}

// Smart Listening Session Types
export type SessionPresetDuration = 5 | 10 | 15 | 20 | 30 | 45 | 60;
export type SessionMode = 'relaxed' | 'learning' | 'active' | 'intensive';

export interface ListeningSession {
  id: string;
  targetMinutes: number;
  sessionName: string; // e.g. "Quick Listening", "Daily Listening", "Deep Practice", "Intensive Listening"
  level: CEFRLevel;
  mode: SessionMode;
  podcasts: Podcast[];
  totalDurationSeconds: number;
  totalDurationFormatted: string; // e.g. "19:42"
  currentPodcastIndex: number;
  completedPodcastIds: string[];
  startedAt: number;
  isFinished: boolean;
  targetOxfordWords?: string[];
  grammarFocus?: string;
}

export interface SessionSummaryData {
  targetMinutes: number;
  actualDurationSeconds: number;
  podcastsCompletedCount: number;
  podcastsCompleted: Podcast[];
  newWordsLearnedCount: number;
  quizScoreAverage: number;
  sessionMode: SessionMode;
  oxfordWordsLearned?: string[];
  grammarPracticed?: string[];
}

export interface Keyword {
  word: string;
  meaning: string;
  example: string;
  phonetic?: string;
}

// Immutable Speaker Profile for Voice Consistency & Continuity
export interface SpeakerProfile {
  speakerId: string; // e.g. "speaker-a", "speaker-b", "narrator", "host", "guest"
  name: string; // e.g. "Emma", "Daniel", "Narrator"
  gender: 'female' | 'male';
  voiceId: 'Kore' | 'Puck' | 'Aoede' | 'Charon' | string;
  stylePrompt?: string;
}

export interface Sentence {
  id: string;
  speaker?: string;
  speakerId?: string;
  voiceId?: string;
  gender?: 'female' | 'male';
  text: string;
  translation: string;
  keywords: Keyword[];
  estimatedDuration?: number; // duration in seconds
  partId?: string;
  grammarNote?: string;
}

export interface PodcastPart {
  id: string;
  title: string;
  titleTr: string;
  startIndex: number;
  endIndex: number;
}

export interface UsefulExpression {
  id: string;
  phrase: string;
  meaning: string;
  example: string;
  exampleTr: string;
  note?: string;
}

export interface GrammarPoint {
  id: string;
  title: string;
  structure: string;
  explanationTr: string;
  examples: Array<{ en: string; tr: string }>;
  sourceSentence?: string;
}

export interface DictationExercise {
  id: string;
  sentenceId: string;
  audioText: string;
  translation: string;
  hintWords?: string[];
}

export interface WordOrderExercise {
  id: string;
  scrambledWords: string[];
  correctSentence: string;
  translation: string;
}

export interface FillBlankExercise {
  id: string;
  sentenceWithBlank: string; // e.g. "I ___ coffee every morning."
  options: string[]; // ["drink", "drinks", "drinking"]
  correctAnswer: string;
  explanation: string;
  explanationTr: string;
}

export interface PodcastSummary {
  en: string;
  tr: string;
  bulletPoints?: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  questionTr?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  explanationTr: string;
  type?: 'comprehension' | 'vocabulary' | 'meaning' | 'main_idea' | 'sentence' | 'true_false';
}

export interface SpeakingTask {
  topic: string;
  initialQuestion: string;
  initialQuestionTr: string;
  sampleAnswers: string[];
  usefulStarters?: string[]; // e.g. "I wake up at...", "I drink..."
}

// Oxford 3000 Definition and User Progress
export type OxfordWordStatus = 'new' | 'seen' | 'learning' | 'familiar' | 'mastered';

export interface OxfordWord {
  id: string;
  word: string;
  cefr: CEFRLevel;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'conjunction' | 'pronoun';
  meaningTr: string;
  exampleEn: string;
  exampleTr: string;
  collocations?: string[];
  frequencyRank?: number;
}

export interface UserOxfordProgress {
  word: string;
  status: OxfordWordStatus;
  seenCount: number;
  masteredCount: number;
  lastSeenAt: number;
  podcastIds: string[];
}

// Curriculum Unit & Structured Learning Path
export interface CurriculumLesson {
  id: string;
  unitId: string;
  title: string;
  titleTr: string;
  podcastId: string;
  order: number;
  grammarTarget: string;
  oxfordTargetCount: number;
  completed?: boolean;
}

export interface CurriculumUnit {
  id: string;
  level: CEFRLevel;
  unitNumber: number;
  title: string;
  titleTr: string;
  topicGroup: TopicGroup;
  description: string;
  lessons: CurriculumLesson[];
  icon: string;
}

// Post-Podcast Learning Report
export interface PostPodcastLearningReport {
  podcastId: string;
  podcastTitle: string;
  newWordsLearnedCount: number;
  newOxfordWords: string[];
  grammarPracticed: string;
  usefulExpressionsCount: number;
  reviewWords: string[];
  listeningScore: number;
}

// Full Podcast Specification
export interface Podcast {
  id: string;
  title: string;
  titleTr: string;
  level: CEFRLevel;
  category: Category;
  topicGroup?: TopicGroup;
  topic?: string;
  contentType?: ContentType;
  format?: ContentFormat; // backwards compat
  challengeType?: ListeningChallengeType;
  duration: number; // in minutes
  durationSeconds?: number;
  difficulty?: number; // 1 to 5
  grammarTargets?: string[];
  oxfordWords?: string[];
  learningObjectives?: string[];
  description: string;
  descriptionTr: string;
  icon: string;
  coverGradient: string;
  accentColor: string;
  whatYoullLearn: string[];
  beforeYouListen?: Keyword[]; // 3-4 prep words shown before starting
  speakerProfiles?: SpeakerProfile[]; // Immutable speaker profiles and voice mappings
  parts?: PodcastPart[];
  transcript: Sentence[];
  usefulExpressions?: UsefulExpression[];
  grammar?: GrammarPoint[];
  dictationExercises?: DictationExercise[];
  wordOrderExercises?: WordOrderExercise[];
  fillBlankExercises?: FillBlankExercise[];
  quiz: QuizQuestion[];
  speakingTask: SpeakingTask;
  summary?: PodcastSummary;
  isFeaturedToday?: boolean;
  version?: number;
  validationReport?: ContentValidationReport;
  unitId?: string;
}

export type MasteryStage = 'new' | 'learning' | 'familiar' | 'mastered';

export interface SavedWord {
  id: string;
  word: string;
  meaning: string;
  example: string;
  podcastId: string;
  podcastTitle: string;
  addedAt: number;
  lastReviewedAt?: number;
  nextReviewAt?: number;
  masteryStage: MasteryStage;
  correctCount: number;
  incorrectCount: number;
  isOxford3000?: boolean;
}

export interface SavedSentence {
  id: string;
  userId: string;
  sentenceId: string;
  text: string;
  translation: string;
  podcastId: string;
  podcastTitle: string;
  addedAt: number;
}

export interface UserPodcastNote {
  userId: string;
  podcastId: string;
  note: string;
  updatedAt: number;
}

export interface PodcastCompletionRecord {
  podcastId: string;
  podcastTitle: string;
  completedAt: number;
  listeningScore: number;
  vocabularyScore: number;
  quizScore: number;
  speakingScore: number;
  overallScore: number;
  status: 'mastered' | 'review' | 'practice_again';
  listeningTimeSeconds: number;
}

export interface InProgressRecord {
  podcastId: string;
  sentenceIndex: number;
  totalSentences: number;
  progressPercent: number;
  lastListenedAt: number;
}

export interface UserAccount {
  id: string;
  username: string;
  displayName: string;
  email: string;
  level: CEFRLevel;
  createdAt: number;
}

export interface UserProgress {
  userId: string;
  level: CEFRLevel;
  onboardingCompleted: boolean;
  isNewUser?: boolean;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  dailyGoalCompleted: boolean;
  totalListeningSeconds: number;
  completedPodcasts: Record<string, PodcastCompletionRecord>;
  inProgressPodcasts: Record<string, InProgressRecord>;
  speakingAttempts: number;
  savedWords: SavedWord[];
  savedSentences?: SavedSentence[];
  savedPodcasts?: string[]; // podcast IDs
  oxfordProgress?: Record<string, UserOxfordProgress>; // strictly per user!
  curriculumCompletedLessons?: string[]; // completed lesson IDs
  darkTheme: boolean;
  playbackSpeed: number; // 0.75, 1.0, 1.25
  listeningMode?: ListeningMode;
  overallProgress: number; // 0 - 100
}

export interface SpeechEvaluationResult {
  score: number;
  accuracyScore: number;
  feedback: string;
  feedbackTr: string;
  missingWords: string[];
  tip: string;
}

export interface AIPartnerMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  textTr?: string;
  correction?: string;
  correctionTr?: string;
  explanation?: string;
}
