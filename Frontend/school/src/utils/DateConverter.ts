export const onlyDate = (date: string | Date) => {
  if (!date) return "-";
  return new Date(date).toISOString().split("T")[0];
};