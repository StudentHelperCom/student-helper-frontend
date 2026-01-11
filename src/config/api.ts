export const BASE_URL = (process.env.NEXT_PUBLIC_API_URL) + "/api" ;

export const API_ROUTES = {
  upload: '/cdn/upload',
  login: '/auth/login',
  register: '/auth/register',
  newClass: '/cdn/create-class',
  classesList: '/cdn/classes',
  classTopics: (classId: string) => `/cdn/class/${classId}/topics`,
  classFiles: (classId: string) => `/cdn/class/${classId}/files`,
  generateTasks: '/quiz/generate',
};

