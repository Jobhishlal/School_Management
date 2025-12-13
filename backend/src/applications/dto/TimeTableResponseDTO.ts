export interface PeriodResponseDTO {
  startTime: string;
  endTime: string;
  subject: string;
  teacherName: string; 
}

export interface DayScheduleResponseDTO {
  day: string;
  periods: PeriodResponseDTO[];
}

export interface TimetableResponseDTO {
  className: string;  
  division: string;
  days: DayScheduleResponseDTO[];
}
