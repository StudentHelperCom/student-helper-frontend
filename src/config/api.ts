import {env} from "@src/env.mjs";

const API_ORIGIN = typeof window === 'undefined'
  ? env.INTERNAL_API_URL
  : env.NEXT_PUBLIC_API_URL;

export const BASE_URL = API_ORIGIN.replace(/\/+$/, '') + "/api" ;

export const API_ROUTES = {
  upload: '/cdn/upload',
  processingStatus: (classId: string) => `/processing/status/${classId}`,
  login: '/auth/login',
  register: '/auth/register',
  newClass: '/cdn/create-class',
  deleteClass: (classId: string) => `/cdn/class/${classId}`,
  classesList: '/cdn/classes',
  classTopics: (classId: string) => `/cdn/class/${classId}/topics`,
  classFiles: (classId: string) => `/cdn/class/${classId}/files`,
  generateTasks: '/quiz/generate',
  evaluateTasks: '/quiz/evaluate',
};

