export function generateSubjectCode(name: string) {
  const prefix = name.slice(0, 3).toUpperCase();
  const randomNum = Math.floor(Math.random() * 900 + 100); 
  return `${prefix}${randomNum}`;
}
