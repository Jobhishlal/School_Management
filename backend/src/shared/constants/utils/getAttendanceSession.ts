import { ATTENDANCE_SESSIONS } from "../../../infrastructure/config/attendance.config";

export function getCurrentSession(): "Morning" | "Afternoon" {
  const now = new Date();
  const minutes =
    now.getHours() * 60 + now.getMinutes();

  if (
    minutes >= ATTENDANCE_SESSIONS.MORNING.start &&
    minutes <= ATTENDANCE_SESSIONS.MORNING.end
  ) {
    return "Morning";
  }

  if (
    minutes >= ATTENDANCE_SESSIONS.AFTERNOON.start &&
    minutes <= ATTENDANCE_SESSIONS.AFTERNOON.end
  ) {
    return "Afternoon";
  }

  throw new Error("Attendance not allowed at this time");
}
