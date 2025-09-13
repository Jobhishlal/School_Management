
const ACCESS_TOKEN_KEY = "accessToken";

export function setAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function removeAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}
export function setSessionToken(token: string) {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getSessionToken(): string | null {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function removeSessionToken() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
}
