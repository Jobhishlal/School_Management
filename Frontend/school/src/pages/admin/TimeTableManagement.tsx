import React, { useEffect, useState } from "react";
import { SelectInput } from "../../components/Form/SelectInput";
import { TextInput } from "../../components/Form/TextInput";
import { Table } from "../../components/Table/Table";
import {
  CreateTimeTable,
  GetTimeTable,
  updateTimeTable,
  deletetimetable,
  classdivisonaccess,
  getTeachersList
} from "../../services/authapi";
import type { CreateTimeTableDTO, DaySchedule, PeriodTime } from "../../types/ITimetable";
import { showToast } from "../../utils/toast";
import { useTheme } from "../../components/layout/ThemeContext";

interface Teacher {
  id?: string;
  _id?: string;
  teacherId?: string;
  name: string;
  department: "LP" | "UP" | "HS";
  subjects: { name: string }[];
}

interface ClassOption {
  _id: string;
  className: string;
  division: string;
  department: "LP" | "UP" | "HS";
}

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const AdminTimeTablePage: React.FC = () => {
  const { isDark } = useTheme();

  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<ClassOption | null>(null);
  const [days, setDays] = useState<DaySchedule[]>([]);
  const [timetableId, setTimetableId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Helper function to check if time is during lunch
  const isLunchTime = (startTime: string, endTime: string): boolean => {
    const start = parseInt(startTime.split(':')[0]);
    const end = parseInt(endTime.split(':')[0]);
    
    // Check if period overlaps with 12:00-13:00
    return (start >= 12 && start < 13) || (end > 12 && end <= 13);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resClasses = await classdivisonaccess();
        const classData: ClassOption[] = Object.values(resClasses.data.data).map((cls: any) => ({
          _id: cls.classId,
          className: cls.className,
          division: cls.division,
          department: cls.department
        }));
        setClasses(classData);

        const resTeachers = await getTeachersList();
        console.log("teacher list", resTeachers);
        setTeachers(resTeachers);
      } catch (err) {
        console.error(err);
        showToast("Failed to fetch classes or teachers");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedClassId || !selectedClass) return;

    const fetchTimeTable = async () => {
      setLoading(true);
      try {
        const res = await GetTimeTable(selectedClassId, selectedClass.division);
        if (res?.data) {
          const formattedDays = res.data.days.map((d: any) => ({
            day: d.day,
            periods: d.periods.map((p: any) => ({
              startTime: p.startTime || "",
              endTime: p.endTime || "",
              subject: p.subject || "",
              teacherId: typeof p.teacherId === "object" ? p.teacherId._id : p.teacherId || ""
            }))
          }));
          setDays(formattedDays);
          setTimetableId(res.data._id || res.data.id || "");
        } else {
          setDays([]);
          setTimetableId("");
        }
      } catch (err) {
        console.error(err);
        setDays([]);
        setTimetableId("");
      } finally {
        setLoading(false);
      }
    };

    fetchTimeTable();
  }, [selectedClassId, selectedClass]);

  const handleClassSelect = (id: string) => {
    setSelectedClassId(id);
    const cls = classes.find(c => c._id === id) || null;
    setSelectedClass(cls);
  };

  const addPeriod = (day: string) => {
    setDays((prev) => {
      const dayIndex = prev.findIndex((d) => d.day === day);

      if (dayIndex >= 0) {
        return prev.map((d, i) => {
          if (i !== dayIndex) return d;

          const periods = [...d.periods];
          const lastPeriod = periods[periods.length - 1];
          let newStartTime = "09:00";
          let newEndTime = "10:00";

          if (lastPeriod && lastPeriod.endTime) {
            const [hours, minutes] = lastPeriod.endTime.split(':').map(Number);

            // If last period ends at 12:00 or during lunch, skip to 13:00
            if (hours === 12 || (hours >= 12 && hours < 13)) {
              newStartTime = "13:00";
              newEndTime = "14:00";
            } else {
              newStartTime = lastPeriod.endTime;
              
              const [newStartH, newStartM] = newStartTime.split(":").map(Number);
              let endHours = newStartH + 1;
              let endMinutes = newStartM;

              // If adding 1 hour crosses into lunch time, skip to 13:00
              if (newStartH < 12 && endHours >= 12) {
                newStartTime = lastPeriod.endTime;
                if (newStartH >= 11) {
                  // Last period before lunch
                  newEndTime = "12:00";
                } else {
                  newEndTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
                }
              } else {
                if (endHours >= 24) endHours = 0;
                newEndTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
              }
            }
          }

          periods.push({
            startTime: newStartTime,
            endTime: newEndTime,
            subject: "",
            teacherId: "",
          });

          return { ...d, periods };
        });
      } else {
        return [
          ...prev,
          {
            day,
            periods: [
              { startTime: "09:00", endTime: "10:00", subject: "", teacherId: "" },
            ],
          }
        ];
      }
    });
  };

  const updatePeriod = (day: string, idx: number, key: keyof PeriodTime, value: string) => {
    setDays(prev =>
      prev.map(d => {
        if (d.day === day) {
          const newPeriods = [...d.periods];
          newPeriods[idx] = { ...newPeriods[idx], [key]: value };

          if (key === 'teacherId') {
            newPeriods[idx].subject = "";
          }

          return { ...d, periods: newPeriods };
        }
        return d;
      })
    );
  };

  const removePeriod = (day: string, idx: number) => {
    setDays(prev =>
      prev.map(d => {
        if (d.day === day) {
          const newPeriods = d.periods.filter((_, i) => i !== idx);
          return { ...d, periods: newPeriods };
        }
        return d;
      })
    );
  };

  const handleCreateOrUpdate = async () => {
    if (!selectedClass) return alert("Select a class");

    const dto: CreateTimeTableDTO = {
      id: timetableId || undefined,
      classId: selectedClassId,
      className: selectedClass.className,
      division: selectedClass.division,
      days
    };

    try {
      if (timetableId) {
        await updateTimeTable(dto);
      } else {
        await CreateTimeTable(dto);
      }
      showToast(`Timetable ${timetableId ? "updated" : "created"} successfully!`);
    } catch (err: any) {
      console.error("Timetable creation/update error:", err);
      const backendMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create/update timetable";
      showToast(backendMessage);
    }
  };

  const handleDelete = async () => {
    if (!timetableId) {
      showToast("Please select a timetable to delete", "info");
      return;
    }

    try {
      await deletetimetable(timetableId);
      setDays([]);
      setTimetableId("");
      showToast("Timetable deleted successfully!");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete timetable");
    }
  };

  // Helper to extract ID
  const getTeacherId = (t: Teacher) => t.teacherId || t.id || t._id || "";

  // Theme Classes
  const containerBg = isDark ? "bg-[#121A21] text-slate-100" : "bg-[#fafbfc] text-slate-900";
  const cardBg = isDark ? "bg-slate-800/50 border-gray-700" : "bg-white border-gray-300";
  const lunchBg = isDark ? "bg-orange-900/30 border-orange-700" : "bg-orange-50 border-orange-300";
  const buttonPrimary = isDark ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white";
  const buttonSecondary = isDark ? "bg-red-600 hover:bg-red-700 text-white" : "bg-red-600 hover:bg-red-700 text-white";
  const buttonAdd = isDark ? "bg-green-600 hover:bg-green-700 text-white" : "bg-green-500 hover:bg-green-600 text-white";
  const buttonDanger = isDark ? "bg-red-500 hover:bg-red-600 text-white" : "bg-red-500 hover:bg-red-600 text-white";

  return (
    <div className={`p-6 rounded min-h-[calc(100vh-2rem)] transition-colors duration-300 ${containerBg}`}>
      <h2 className="text-xl font-bold mb-4">Admin Class Timetable</h2>

      <div className="flex gap-4 mb-4">
        <SelectInput
          label="Select Class"
          value={selectedClassId}
          onChange={handleClassSelect}
          options={classes.map(c => ({ value: c._id, label: `${c.className} - ${c.division}` }))}
          isDark={isDark}
        />
      </div>

      {loading && <p>Loading timetable...</p>}

      {weekDays.map(day => {
        const daySchedule = days.find(d => d.day === day);
        const allPeriods = daySchedule?.periods || [];
        
        // Sort periods by start time
        const sortedPeriods = [...allPeriods].sort((a, b) => {
          const timeA = parseInt(a.startTime.replace(':', ''));
          const timeB = parseInt(b.startTime.replace(':', ''));
          return timeA - timeB;
        });

        // Check if lunch break needs to be shown
        const hasPeriodsBeforeLunch = sortedPeriods.some(p => {
          const endHour = parseInt(p.endTime.split(':')[0]);
          return endHour === 12;
        });

        const hasPeriodsAfterLunch = sortedPeriods.some(p => {
          const startHour = parseInt(p.startTime.split(':')[0]);
          return startHour >= 13;
        });

        const showLunchBreak = hasPeriodsBeforeLunch || hasPeriodsAfterLunch;

        return (
          <div key={day} className={`mb-4 border p-4 rounded ${cardBg}`}>
            <h3 className="font-semibold mb-3 text-lg">{day}</h3>
            
            {sortedPeriods.length === 0 ? (
              <p className={`text-sm mb-3 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                No periods added yet
              </p>
            ) : (
              sortedPeriods.map((p, idx) => {
                const actualIdx = allPeriods.indexOf(p);
                const shouldShowLunchAfter = parseInt(p.endTime.split(':')[0]) === 12;

                return (
                  <React.Fragment key={actualIdx}>
                    <div className="flex gap-2 mb-3 flex-wrap items-end">
                      <TextInput
                        label="Start"
                        type="time"
                        value={p.startTime}
                        onChange={val => updatePeriod(day, actualIdx, "startTime", val)}
                        isDark={isDark}
                      />
                      <TextInput
                        label="End"
                        type="time"
                        value={p.endTime}
                        onChange={val => updatePeriod(day, actualIdx, "endTime", val)}
                        isDark={isDark}
                      />
                      <SelectInput
                        label="Teacher"
                        value={p.teacherId}
                        onChange={val => updatePeriod(day, actualIdx, "teacherId", val)}
                        options={teachers.map(t => ({ value: getTeacherId(t), label: t.name }))}
                        isDark={isDark}
                      />
                      <SelectInput
                        label="Subject"
                        value={p.subject}
                        onChange={(val) => updatePeriod(day, actualIdx, "subject", val)}
                        options={
                          teachers.find((t) => getTeacherId(t) === p.teacherId)?.subjects?.map((s) => ({
                            value: s.name,
                            label: s.name,
                          })) || []
                        }
                        isDark={isDark}
                        disabled={!p.teacherId}
                      />
                      <button
                        onClick={() => removePeriod(day, actualIdx)}
                        className={`px-3 py-2 rounded text-sm ${buttonDanger} transition-colors duration-200`}
                        title="Remove Period"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Show Lunch Break after period ending at 12:00 */}
                    {shouldShowLunchAfter && (
                      <div className={`mb-3 p-3 rounded border ${lunchBg} flex items-center justify-center`}>
                        <span className="font-semibold text-orange-600 dark:text-orange-400">
                          🍽️ Lunch Break (12:00 - 13:00)
                        </span>
                      </div>
                    )}
                  </React.Fragment>
                );
              })
            )}

            <button
              onClick={() => addPeriod(day)}
              className={`px-3 py-2 rounded text-sm ${buttonAdd} transition-colors duration-200`}
            >
              + Add Period
            </button>
          </div>
        );
      })}

      <div className="flex gap-2 mt-4 flex-wrap">
        <button
          onClick={handleCreateOrUpdate}
          className={`px-4 py-2 rounded ${buttonPrimary} transition-colors duration-200`}
        >
          {timetableId ? "Update Timetable" : "Create Timetable"}
        </button>
        <button
          onClick={handleDelete}
          className={`px-4 py-2 rounded ${buttonSecondary} transition-colors duration-200`}
        >
          Delete Timetable
        </button>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Existing Class Timetables</h3>
        <Table
          columns={[
            { label: "Class", key: "className" },
            { label: "Division", key: "division" },
            {
              label: "Action",
              key: "action",
              render: (row: ClassOption) => (
                <button
                  onClick={() => {
                    setSelectedClass(row);
                    setSelectedClassId(row._id);
                  }}
                  className={`px-2 py-1 rounded ${buttonPrimary} transition-colors duration-200`}
                >
                  Edit/Update
                </button>
              )
            }
          ]}
          data={classes}
          isDark={isDark}
        />
      </div>
    </div>
  );
};

export default AdminTimeTablePage;