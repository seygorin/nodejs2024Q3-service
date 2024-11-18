export interface UserResponse {
  id: string;
  login: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

export interface UserFull
  extends Omit<UserResponse, 'createdAt' | 'updatedAt'> {
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
