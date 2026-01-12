export interface TeacherDailyScheduleDTO {
  day: string;
  className?: string;
  division?: string;
  startTime: string;
  endTime: string;
  subject: string;
  type: 'class' | 'break' | 'rest';
}
