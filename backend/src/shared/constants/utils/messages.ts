export const EmailMessages = {
  STUDENT_REGISTRATION: (parentName: string, studentName: string, studentId: string, tempPassword: string) =>
    `Hello ${parentName},\n\nYour child ${studentName} has been registered successfully.\n\n🆔 Student ID: ${studentId}\n🔑 Password: ${tempPassword}\n\nPlease keep this information safe.`
};
