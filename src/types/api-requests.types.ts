// Register

export interface RegisterPayload {
  login: string;
  password: string;
}

export interface RegisterResponseSuccess {
  status: string;
  idu: string;
}

// Login

export interface LoginPayload {
  login: string;
  password: string;
}

export interface LoginResponseSuccess {
  status: string;
  idu?: string;
}

// Upload

export interface UploadPayload {
  files: File[];
  className: string;
  token: string;
}

// New class

export interface NewClassPayload {
  className: string;
  examDate: string;
  examLocation: string;
}

// Delete class

export interface DeleteClassPayload {
  classId: string;
}

// Class List

export interface ClassListResponse {
  classID: string;
  name: string;
  examDate: string;
  examLocation: string;
  createdAt: string;
  updatedAt: string;
}

// Topics List

export interface TopicItem {
  topicID: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type TopicsListResponse = TopicItem[];

// Files List

export interface FileItem {
  size: number;
  filename: string;
  created: string;
}

export type FilesListResponse = {
  classId: string,
  className: string,
  totalFiles: number,
  files: FileItem[],
};

// Quiz Mode

export interface QuizAnswers {
  text: string;
  is_correct: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  answers: QuizAnswers[];
}

export interface QuizModeType {
  mode: 'quiz';
  questions: QuizQuestion[];
}

// Flip cards Mode

export interface Card {
  answer: string;
  id: number;
  question: string;
}

export interface CardsModeType {
  mode: 'cards';
  flashcards: Card[];
}

// Expanded answers Mode

export interface ExpQuestion {
  id: number;
  question: string;
}

export interface ExpandedModeType {
  mode: 'expanded';
  questions: ExpQuestion[];
}

// Summary Mode

export type SummaryHeading = {
  type: 'heading';
  value: string;
};

export type SummaryText = {
  type: 'text';
  value: string;
};

export type SummaryList = {
  type: 'list';
  items: string[];
};

export type SummaryBlock = SummaryHeading | SummaryText | SummaryList;

export interface SummaryModeType {
  mode: 'summary';
  summary: SummaryBlock[];
}

// Modes

export interface ModeGeneratorPayload {
  mode: string;
  topicIds: string[];
}

export type ModeGeneratorResponse = QuizModeType | CardsModeType | ExpandedModeType;

// Evaluate answers

export interface EvaluatePair {
  id: number;
  question: string;
  answers: string;
}

export interface EvaluatePayload {
  topicIds: string[];
  answers: EvaluatePair[];
}

export interface EvaluatedQuestion {
  id: number;
  question: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  problems: string[];
}

export interface EvaluatedResponse {
  status: 'evaluated';
  results: EvaluatedQuestion[];
}