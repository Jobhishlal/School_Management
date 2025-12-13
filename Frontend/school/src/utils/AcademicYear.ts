export const generateAcademicYears = (range = 5): string[] => {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  for (let i = 0; i < range; i++) {
    years.push(`${currentYear + i}-${currentYear + i + 1}`);
  }
  return years;
};
