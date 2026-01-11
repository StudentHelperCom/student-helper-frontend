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
  token: string;
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

// Modes

export interface ModeGeneratorPayload {
  mode: string;
  topicIds: string[];
}

export type ModeGeneratorResponse = QuizModeType | CardsModeType;