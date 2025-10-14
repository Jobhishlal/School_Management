import React, { useEffect, useState } from "react";
import { TextInput } from "../../components/Form/TextInput";
import { SelectInput } from "../../components/Form/SelectInput";
import { Table } from "../../components/Table/Table";
import type { CreateTimeTableDTO, DaySchedule, PeriodTime } from "../../types/ITimetable";
import { CreateTimeTable, GetTimeTable, updateTimeTable, deletetimetable, getTeachersList, classdivisonaccess } from "../../services/authapi";

interface Teacher {
  teacherId: string;
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

const TimeTableManagement: React.FC = () => {
  const [timetableId, setTimetableId] = useState<string>("");
  const [days, setDays] = useState<DaySchedule[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [classId, setClassId] = useState<string>("");
  const [className,setClassName]=useState<string>("")
  const [division, setDivision] = useState<string>("");
  const [department, setDepartment] = useState<"LP" | "UP" | "HS" | "">("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch classes and teachers on mount
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const teachersData: Teacher[] = await getTeachersList();
        setTeachers(teachersData);
      } catch (err) {
        console.error("Failed to fetch teachers", err);
      }
    };

    const fetchClasses = async () => {
      try {
        const res = await classdivisonaccess();
        const data = res.data?.data;
        if (!data || typeof data !== "object") return;

        const formattedClasses: ClassOption[] = Object.values(data).map((cls: any) => ({
          _id: cls.classId,
          className: cls.className,
          division: cls.division,
          department: cls.department
        }));
        setClasses(formattedClasses);
      } catch (err) {
        console.error("Failed to fetch classes", err);
      }
    };

    fetchTeachers();
    fetchClasses();
  }, []);

  // Fetch existing timetable for selected class
  const fetchTimeTable = async () => {
    if (!classId || !division) return;
    setLoading(true);
    try {
      const res = await GetTimeTable(classId, division);
      setDays(res?.days || []);
      setTimetableId(res?._id || "");
    } catch (err) {
      console.error(err);
      alert("Failed to fetch timetable");
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (selectedId: string) => {
    setClassId(selectedId);
    const selectedClass = classes.find(c => c._id === selectedId);
    if (selectedClass) {
      setClassName(selectedClass.className)
      setDivision(selectedClass.division);
      setDepartment(selectedClass.department);
    } else {
      setClassName("")
      setDivision("");
      setDepartment("");
    }
  };

  // Add a period to a day
  const addPeriod = (day: string) => {
    setDays(prev => {
      const updated = [...prev];
      const dayIndex = updated.findIndex(d => d.day === day);
      if (dayIndex >= 0) {
        updated[dayIndex].periods.push({ startTime: "", endTime: "", subject: "", teacherId: "" });
      } else {
        updated.push({ day, periods: [{ startTime: "", endTime: "", subject: "", teacherId: "" }] });
      }
      return updated;
    });
  };

  // Update a period field
  const updatePeriod = (day: string, periodIndex: number, key: keyof PeriodTime, value: string) => {
    setDays(prev =>
      prev.map(d => {
        if (d.day === day) d.periods[periodIndex][key] = value;
        return d;
      })
    );
  };

  // Create timetable
  const handleCreate = async () => {
    if (!classId || !className || !division) return alert("Select Class & Division");

    // Ensure at least empty days exist
    const daysToSend = days.length > 0 ? days : weekDays.map(day => ({ day, periods: [] }));

    const dto: CreateTimeTableDTO = { classId, className, division, days: daysToSend };
    try {
      await CreateTimeTable(dto);
      alert("Timetable created successfully!");
      fetchTimeTable(); // refresh after create
    } catch (err) {
      console.error(err);
      alert("Failed to create timetable");
    }
  };

  // Update timetable
  const handleUpdate = async () => {
    if (!timetableId) return alert("No timetable selected!");
    const dto: CreateTimeTableDTO = { id: timetableId, classId, className, division, days };
    try {
      await updateTimeTable(dto);
      alert("Timetable updated successfully!");
      fetchTimeTable();
    } catch (err) {
      console.error(err);
      alert("Failed to update timetable");
    }
  };

  // Delete timetable
  const handleDelete = async () => {
    try {
      await deletetimetable(classId, division);
      setDays([]);
      alert("Timetable deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete timetable");
    }
  };

  // Filter teachers by subject & department
  const getAvailableTeachers = (subject: string) => {
    if (!department) return [];
    return teachers.filter(
      t => t.department === department && t.subjects?.some(s => s.name === subject)
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">TimeTable Management</h2>

      <div className="flex gap-4 mb-4">
        <SelectInput
          label="Class"
          value={classId}
          onChange={handleClassChange}
          options={classes.map(c => ({ value: c._id, label: `${c.className} - ${c.division}` }))}
        />
        <TextInput label="Class Name" value={className} readOnly />
        <TextInput label="Division" value={division} readOnly />
        <button onClick={fetchTimeTable} className="px-4 py-2 bg-blue-600 text-white rounded">
          Fetch
        </button>
      </div>

      {weekDays.map(day => (
        <div key={day} className="mb-4 p-2 border rounded">
          <h3 className="font-semibold">{day}</h3>
          {days.find(d => d.day === day)?.periods.map((p, idx) => {
            const availableTeachers = getAvailableTeachers(p.subject);
            return (
              <div key={idx} className="flex gap-2 my-1">
                <TextInput
                  label="Start Time"
                  value={p.startTime}
                  onChange={val => updatePeriod(day, idx, "startTime", val)}
                />
                <TextInput
                  label="End Time"
                  value={p.endTime}
                  onChange={val => updatePeriod(day, idx, "endTime", val)}
                />
                <TextInput
                  label="Subject"
                  value={p.subject}
                  onChange={val => updatePeriod(day, idx, "subject", val)}
                />
                <SelectInput
                  label="Teacher"
                  value={p.teacherId}
                  onChange={val => updatePeriod(day, idx, "teacherId", val)}
                  options={teachers.map(t => ({ value: t.teacherId, label: t.name }))}
                />
              </div>
            );
          })}
          <button
            onClick={() => addPeriod(day)}
            className="mt-2 px-2 py-1 text-sm bg-green-500 text-white rounded"
          >
            Add Period
          </button>
        </div>
      ))}

      <div className="flex gap-4 mt-4">
        <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded">
          Create
        </button>
        <button onClick={handleUpdate} className="px-4 py-2 bg-yellow-600 text-white rounded">
          Update
        </button>
        <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">
          Delete
        </button>
      </div>

      <div className="mt-6">
        <Table
          columns={[
            { label: "Day", key: "day" },
            {
              label: "Periods",
              key: "periods",
              render: (row: DaySchedule) =>
                row.periods.map(p => `${p.startTime}-${p.endTime} ${p.subject}`).join(", ")
            }
          ]}
          data={days}
        />
      </div>
    </div>
  );
};

export default TimeTableManagement;
