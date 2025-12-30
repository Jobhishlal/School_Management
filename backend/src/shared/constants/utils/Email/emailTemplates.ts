export const EMAIL_SUBJECTS = {
  STUDENT_ABSENT: "Student Absence Notification",
} as const;


export const EmailTemplates = {
  studentAbsent: ({
    studentName,
    status,
    session,
    date,
  }: {
    studentName: string;
    status: string;
    session: string;
    date: string;
  }) => `
Dear Parent,

Your child ${studentName} was marked ${status} for the ${session} session on ${date}.

Please contact the school for any clarifications.

Regards,
School Administration
  `.trim()
};
