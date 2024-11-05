export interface UserResponse {
  id: string;
  login: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

export class User {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  validate(): boolean {
    return Boolean(
      this.login?.trim() &&
        this.password?.trim() &&
        typeof this.version === 'number' &&
        typeof this.createdAt === 'number' &&
        typeof this.updatedAt === 'number',
    );
  }

  checkPassword(password: string): boolean {
    return this.password === password;
  }

  updatePassword(newPassword: string): void {
    this.password = newPassword;
    this.version += 1;
    this.updatedAt = Date.now();
  }

  toResponse(): UserResponse {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}
