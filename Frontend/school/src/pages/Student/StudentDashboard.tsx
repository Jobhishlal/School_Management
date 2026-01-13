import React from 'react';
import { MeetingList } from '../common/MeetingList';

export default function StudentDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      <p className="mb-6">Welcome to your student portal! Here you can access your attendance, assignments, timetable, exams, and more.</p>
      <MeetingList />
    </div>
  );
}