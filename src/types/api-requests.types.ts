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