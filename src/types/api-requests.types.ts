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
  files: File[],
  className: string,
  token: string,
}

// New class

export interface NewClassPayload {
  className: string,
  examDate: string,
  examLocation: string,
  token: string,
}

// Class List

export interface ClassListResponse {
  id: string,
  userId: string,
  name: string,
  examDate: string,
  examLocation: string,
  createdAt: string,
  updatedAt: string,
}

// Topics List

export interface TopicItem {
  id: string;
  classId: string;
  topicName: string;
  createdAt: string;
}

export type TopicsListResponse = TopicItem[];

// Quiz

export interface GenerateQuizPayload {
  mode: string;
  topicIds: string[];
}

export interface QuizAnswer {
  text: string;
  is_correct: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  answers: QuizAnswer[];
}

export interface GenerateQuizResponse {
  mode: string;
  questions: QuizQuestion[];
}