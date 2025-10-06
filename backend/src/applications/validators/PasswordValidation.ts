import { passwordError } from "../../domain/enums/PasswordError";

export function ValidateSubAdminPassword(password: string): void {
  if (!password || password.trim() === "") {
    throw new Error(passwordError.PASSWORD_REQUIRED);
  }

  if (password.length < 8) {
    throw new Error(passwordError.PASSWORD_TOO_SHORT);
  }

  if (!/[A-Z]/.test(password)) {
    throw new Error(passwordError.PASSWORD_MISSING_UPPERCASE);
  }

  if (!/[a-z]/.test(password)) {
    throw new Error(passwordError.PASSWORD_MISSING_LOWERCASE);
  }

  if (!/[0-9]/.test(password)) {
    throw new Error(passwordError.PASSWORD_MISSING_NUMBER);
  }

  if (!/[@$!%*?&]/.test(password)) {
    throw new Error(passwordError.PASSWORD_MISSING_SPECIAL);
  }
}
