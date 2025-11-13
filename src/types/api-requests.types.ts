// Register

export interface RegisterPayload {
  login: string;
  password: string;
}

export interface RegisterResponseSuccess {
  status: string;
  idu: string;
}

export interface RegisterResponseError {
  message: string[];
  error: string;
  statusCode: number;
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

export interface LoginResponseError {
  message: string[];
  error: string;
  statusCode: number;
}