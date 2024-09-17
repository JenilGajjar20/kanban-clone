export interface Login {
  email: string;
  password: string;
}

export interface Register extends Login {
  firstName: string;
  lastName: string;
}

export interface Response {
  accessToken: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}
