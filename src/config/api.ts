export const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001') + "/api" ;

export const API_ROUTES = {
  upload: '/cdn/upload',
  login: '/auth/login',
  register: '/auth/register',
  newClass: '/cdn/create-class',
  classesList: '/cdn/classes',
};