export function isOnlyNumbers(value: string): boolean {
  return /^[0-9]+$/.test(value);
}

export function isOnlySpecialChars(value: string): boolean {
  return /^[^a-zA-Z0-9]+$/.test(value);
}

export function isValidText(value: string): boolean {
  const trimmed = value.trim();

  if (trimmed.length === 0) return false;         
  if (isOnlyNumbers(trimmed)) return false;       
  if (isOnlySpecialChars(trimmed)) return false;  

  return true;                                    
}
