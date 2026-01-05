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
            })),
            breaks: d.breaks?.map((b: any) => ({
              startTime: b.startTime || "",
              endTime: b.endTime || "",
              name: b.name || ""
            })) || []
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
            const [lastEndH, lastEndM] = lastPeriod.endTime.split(':').map(Number);

            
            let startH = lastEndH;
            let startM = lastEndM;

            const overlappingBreak = d.breaks?.find(b => b.startTime === lastPeriod.endTime);
            if (overlappingBreak && overlappingBreak.endTime) {
              const [breakEndH, breakEndM] = overlappingBreak.endTime.split(':').map(Number);
              startH = breakEndH;
              startM = breakEndM;
            } else {

            }

            // Check 16:00 Limit for Start Time
            if (startH >= 16) {
              showToast("Cannot add periods after 4:00 PM", "error");
              return d;
            }

            newStartTime = `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`;

            // 2. Determine Duration (match last period)
            let effectiveDuration = 60; // Default 1 hour
            if (lastPeriod.startTime) {
              const [lastStartH, lastStartM] = lastPeriod.startTime.split(':').map(Number);
              const durationMinutes = (lastEndH * 60 + lastEndM) - (lastStartH * 60 + lastStartM);
              if (durationMinutes > 0) effectiveDuration = durationMinutes;
            }

            // 3. Calculate New End Time
            const newStartTotalMinutes = startH * 60 + startM;
            const newEndTotalMinutes = newStartTotalMinutes + effectiveDuration;

            let endH = Math.floor(newEndTotalMinutes / 60);
            let endM = newEndTotalMinutes % 60;

            // Cap at 16:00
            if (endH > 16 || (endH === 16 && endM > 0)) {
              endH = 16;
              endM = 0;
            }

            newEndTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
          }

          // Final safety check if end time <= start time (e.g. capped at 16:00 but start was 15:50)
          // Ideally we allow it and let validator catch or user fix, but let's ensure it's validish
          const [finalStartH, finalStartM] = newStartTime.split(':').map(Number);
          const [finalEndH, finalEndM] = newEndTime.split(':').map(Number);

          if (finalEndH < finalStartH || (finalEndH === finalStartH && finalEndM <= finalStartM)) {
            // If duration squeeze made it invalid, just add 10 mins or cap
            // But if start is 16:00, we already returned above.
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
            breaks: []
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

  const addBreak = (day: string) => {
    setDays(prev => {
      const dayIndex = prev.findIndex(d => d.day === day);
      if (dayIndex >= 0) {
        return prev.map(d => {
          if (d.day === day) {
            const breaks = d.breaks ? [...d.breaks] : [];
            breaks.push({ startTime: "10:00", endTime: "10:15", name: "Break" });
            return { ...d, breaks };
          }
          return d;
        });
      } else {
        return [
          ...prev,
          {
            day,
            periods: [],
            breaks: [{ startTime: "10:00", endTime: "10:15", name: "Break" }]
          }
        ];
      }
    });
  };

  const removeBreak = (day: string, idx: number) => {
    setDays(prev =>
      prev.map(d => {
        if (d.day === day) {
          const breaks = d.breaks ? d.breaks.filter((_, i) => i !== idx) : [];
          return { ...d, breaks };
        }
        return d;
      })
    );
  };

  const updateBreak = (day: string, idx: number, key: 'startTime' | 'endTime' | 'name', value: string) => {
    setDays(prev =>
      prev.map(d => {
        if (d.day === day) {
          const breaks = d.breaks ? [...d.breaks] : [];
          if (breaks[idx]) {
            // Validate time limit for breaks too
            if (key === 'startTime' || key === 'endTime') {
              const [h, m] = value.split(":").map(Number);
              if (h > 16 || (h === 16 && m > 0)) {
                showToast("Breaks cannot go beyond 4:00 PM", "error");
                return d; // Ignore change
              }
            }
            breaks[idx] = { ...breaks[idx], [key]: value };
          }
          return { ...d, breaks };
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

    // Client-side validation: Check Breaks and Gaps
    for (const d of days) {
      if (d.breaks) {
        for (const b of d.breaks) {
          const [startH, startM] = b.startTime.split(':').map(Number);
          const [endH, endM] = b.endTime.split(':').map(Number);
          const startTotal = startH * 60 + startM;
          const endTotal = endH * 60 + endM;

          if (endTotal <= startTotal) {
            showToast(`Break on ${d.day} has invalid time: End time must be after Start time`, "error");
            return;
          }
        }
      }

      // Check for Gaps
      const allSlots = [
        ...(d.periods || []).map(p => ({ ...p, type: 'Period' })),
        ...(d.breaks || []).map(b => ({ ...b, type: 'Break' }))
      ].sort((a, b) => {
        const timeA = parseInt(a.startTime.replace(':', ''));
        const timeB = parseInt(b.startTime.replace(':', ''));
        return timeA - timeB;
      });

      for (let i = 0; i < allSlots.length - 1; i++) {
        const current = allSlots[i];
        const next = allSlots[i + 1];

        if (current.endTime !== next.startTime) {
          showToast(`Gap detected on ${d.day} between ${current.endTime} and ${next.startTime}`, "error");
          return;
        }
      }
    }

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


        return (
          <div key={day} className={`mb-4 border p-4 rounded ${cardBg}`}>
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg">{day}</h3>
              <div className="flex flex-col gap-2">
                {daySchedule?.breaks?.map((b, bIdx) => (
                  <div key={bIdx} className="flex gap-2 items-end bg-gray-50 dark:bg-gray-800 p-2 rounded">
                    <TextInput
                      label="Name"
                      type="text"
                      value={b.name || "Break"}
                      onChange={(val) => updateBreak(day, bIdx, "name", val)}
                      isDark={isDark}
                    />
                    <TextInput
                      label="Start"
                      type="time"
                      value={b.startTime}
                      onChange={(val) => updateBreak(day, bIdx, "startTime", val)}
                      isDark={isDark}
                    />
                    <TextInput
                      label="End"
                      type="time"
                      value={b.endTime}
                      onChange={(val) => updateBreak(day, bIdx, "endTime", val)}
                      isDark={isDark}
                    />
                    <button
                      onClick={() => removeBreak(day, bIdx)}
                      className={`px-2 py-1 text-xs rounded ${buttonDanger} h-8 self-end mb-1`}
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addBreak(day)}
                  className={`px-3 py-1 text-xs rounded ${buttonAdd} self-end`}
                >
                  + Add Break
                </button>
              </div>
            </div>

            {sortedPeriods.length === 0 ? (
              <p className={`text-sm mb-3 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                No periods added yet
              </p>
            ) : (
              sortedPeriods.map((p) => {
                const actualIdx = allPeriods.indexOf(p);


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
                      <div className="flex flex-col items-center justify-end pb-2 px-1">
                        <label className={`text-xs mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          Break?
                        </label>
                        <input
                          type="checkbox"
                          checked={p.subject === "Break"}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updatePeriod(day, actualIdx, "subject", "Break");
                              updatePeriod(day, actualIdx, "teacherId", "");
                            } else {
                              updatePeriod(day, actualIdx, "subject", "");
                            }
                          }}
                          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <SelectInput
                        label="Teacher"
                        value={p.teacherId}
                        onChange={val => updatePeriod(day, actualIdx, "teacherId", val)}
                        options={teachers.map(t => ({ value: getTeacherId(t), label: t.name }))}
                        isDark={isDark}
                        disabled={p.subject === "Break"}
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
                        disabled={(!p.teacherId && p.subject !== "Break") || p.subject === "Break"}
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