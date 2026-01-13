
import React from 'react';
import { MeetingList } from '../common/MeetingList';

export default function TeacherDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
      <p className="mb-6">Welcome to your Teacher portal! Here you can access your attendance, assignments, timetable, exams, and more.</p>

      <MeetingList />
    </div>
  );
}