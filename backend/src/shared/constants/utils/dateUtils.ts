/**
 * Adds a specific number of days to a given date
 * @param startDate - The start date (default: now)
 * @param days - Number of days to add
 * @returns 
 */
export function calculateExpiryDate(startDate: Date = new Date(), days: number = 4): Date {
  return new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);
}

/**
 * Checks if a given date is expired
 * @param expiryDate - The expiry date
 * @returns boolean - true if expired, false otherwise
 */
export function isExpired(expiryDate: Date): boolean {
  return new Date() > expiryDate;
}
