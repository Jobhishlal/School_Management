



// import React, { useEffect, useState } from "react";
// import { SelectInput } from "../../components/Form/SelectInput";
// import { TextInput } from "../../components/Form/TextInput";
// import { Table } from "../../components/Table/Table";
// import {
//   CreateTimeTable,
//   GetTimeTable,
//   updateTimeTable,
//   deletetimetable,
//   classdivisonaccess,
//   getTeachersList
// } from "../../services/authapi";
// import type { CreateTimeTableDTO, DaySchedule, PeriodTime } from "../../types/ITimetable";
// import { showToast } from "../../utils/toast";


// interface Teacher {
//   teacherId: string;
//   name: string;
//   department: "LP" | "UP" | "HS";
//   subjects: { name: string }[];
// }

// interface ClassOption {
//   _id: string;
//   className: string;
//   division: string;
//   department: "LP" | "UP" | "HS";
// }

// const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// const AdminTimeTablePage: React.FC = () => {
//   const [classes, setClasses] = useState<ClassOption[]>([]);
//   const [teachers, setTeachers] = useState<Teacher[]>([]);
//   const [selectedClassId, setSelectedClassId] = useState<string>("");
//   const [selectedClass, setSelectedClass] = useState<ClassOption | null>(null);
//   const [days, setDays] = useState<DaySchedule[]>([]);
//   const [timetableId, setTimetableId] = useState<string>("");
//   const [loading, setLoading] = useState(false);

  
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const resClasses = await classdivisonaccess();
//         const classData: ClassOption[] = Object.values(resClasses.data.data).map((cls: any) => ({
//           _id: cls.classId,
//           className: cls.className,
//           division: cls.division,
//           department: cls.department
//         }));
//         setClasses(classData);

//         const resTeachers = await getTeachersList();
//         setTeachers(resTeachers);
//       } catch (err) {
//         console.error(err);
//         showToast("Failed to fetch classes or teachers");
//       }
//     };
//     fetchData();
//   }, []);


//   useEffect(() => {
//   if (!selectedClassId || !selectedClass) return;

//   const fetchTimeTable = async () => {
//     setLoading(true);
//     try {
//       const res = await GetTimeTable(selectedClassId, selectedClass.division);
//       console.log("get timetable here ",res)
//       if (res?.data) {
//         setDays(res.data.days || []);
//         setTimetableId(res.data._id || res.data.id); 
//       } else {
//         setDays([]);
//         setTimetableId(""); 
//       }
//     } catch (err) {
//       console.error(err);
//       setDays([]);
//       setTimetableId("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchTimeTable();
// }, [selectedClassId, selectedClass]);


//   const handleClassSelect = (id: string) => {
//     setSelectedClassId(id);
//     const cls = classes.find(c => c._id === id) || null;
//     setSelectedClass(cls);
//   };

//   const addPeriod = (day: string) => {
//   setDays(prev => {
//     const updated = [...prev];
//     const dayIndex = updated.findIndex(d => d.day === day);

//     if (dayIndex >= 0) {
    
//       const hasEmpty = updated[dayIndex].periods.some(p => !p.startTime && !p.endTime && !p.subject && !p.teacherId);
//       if (!hasEmpty) {
//         updated[dayIndex].periods.push({ startTime: "", endTime: "", subject: "", teacherId: "" });
//       }
//     } else {
//       updated.push({ day, periods: [{ startTime: "", endTime: "", subject: "", teacherId: "" }] });
//     }

//     return updated;
//   });
// };


//   const updatePeriod = (day: string, idx: number, key: keyof PeriodTime, value: string) => {
//     setDays(prev =>
//       prev.map(d => {
//         if (d.day === day) d.periods[idx][key] = value;
//         return d;
//       })
//     );
//   };

//           const handleCreateOrUpdate = async () => {
//   if (!selectedClass) return alert("Select a class");

//   const dto: CreateTimeTableDTO = {
//     id: timetableId || undefined,
//     classId: selectedClassId,
//     className: selectedClass.className,
//     division: selectedClass.division,
//     days
//   };

//   try {
//     if (timetableId) {
//       console.log("Updating existing timetable", dto);
//       await updateTimeTable(dto); 
//     } else {
//       console.log("Creating new timetable", dto);
//       await CreateTimeTable(dto);
//     }

//     showToast(`Timetable ${timetableId ? "updated" : "created"} successfully!`);
//   } catch (err: any) {
//     console.error("Timetable creation/update error:", err);

//     const backendMessage =
//       err?.response?.data?.message ||
//       err?.message ||
//       "Failed to create/update timetable";

//     showToast(backendMessage);
//   }
// };



//   const handleEditTimetable = async (classId: string) => {
//   const cls = classes.find(c => c._id === classId) || null;
//   setSelectedClass(cls);
//   setSelectedClassId(classId);
 
//   console.log("classId",cls)
//   if (!cls) return;

//   try {
//     setLoading(true);
//     const res = await GetTimeTable(classId, cls.division);

//     if (res?.data) {
//       setDays(res.data.days || []);
//       setTimetableId(res.data._id || ""); 
//     } else {
//       setDays([]);
//       setTimetableId("");
//     }
//   } catch (err) {
//     console.error(err);
//     setDays([]);
//     setTimetableId("");
//   } finally {
//     setLoading(false);
//   }
// };


// const handleDelete = async () => {
//   if (!timetableId) {
//     showToast("Please select a timetable to delete", "info");
//     return;
//   }

//   try {
//     await deletetimetable(timetableId);
//     setDays([]);
//     setTimetableId("");
//     showToast("Timetable deleted successfully!");
//   } catch (err) {
//     console.error(err);
//     showToast("Failed to delete timetable");
//   }
// };


//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold mb-4">Admin Class Timetable</h2>

//       <div className="flex gap-4 mb-4">
//         <SelectInput
//           label="Select Class"
//           value={selectedClassId}
//           onChange={handleClassSelect}
//           options={classes.map(c => ({ value: c._id, label: `${c.className} - ${c.division}` }))}
//         />
//       </div>

//       {loading ? <p>Loading timetable...</p> : null}

//       {weekDays.map(day => (
//         <div key={day} className="mb-4 border p-2 rounded">
//           <h3 className="font-semibold">{day}</h3>
//           {days.find(d => d.day === day)?.periods.map((p, idx) => (
//             <div key={idx} className="flex gap-2 mb-2">
//               <TextInput label="Start" value={p.startTime} onChange={v => updatePeriod(day, idx, "startTime", v)} />
//               <TextInput label="End" value={p.endTime} onChange={v => updatePeriod(day, idx, "endTime", v)} />
//               <TextInput label="Subject" value={p.subject} onChange={v => updatePeriod(day, idx, "subject", v)} />
//               <SelectInput
//                 label="Teacher"
//                 value={p.teacherId}
//                 onChange={v => updatePeriod(day, idx, "teacherId", v)}
//                 options={teachers.map(t => ({ value: t.teacherId, label: t.name }))}
//               />
//             </div>
//           ))}
//           <button onClick={() => addPeriod(day)} className="px-2 py-1 bg-green-500 text-white rounded">Add Period</button>
//         </div>
//       ))}

//       <div className="flex gap-2 mt-4">
//         <button onClick={handleCreateOrUpdate} className="px-4 py-2 bg-blue-600 text-white rounded">
//           {timetableId ? "Update Timetable" : "Create Timetable"}
//         </button>
//         <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete Timetable</button>
//       </div>

//       <div className="mt-6">
//         <h3 className="font-semibold mb-2">Existing Class Timetables</h3>
//         <Table
//           columns={[
//             { label: "Class", key: "className" },
//             { label: "Division", key: "division" },
//             {
//               label: "Action",
//               key: "action",
//               render: (row: ClassOption) => (
//                 <button onClick={() => handleEditTimetable(row._id)} className="px-2 py-1 bg-blue-500 text-white rounded">
//                   Edit/Update
//                 </button>
//               )
//             }
//           ]}
//           data={classes}
//         />
//       </div>
//     </div>
//   );
// };

// export default AdminTimeTablePage;







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
import dayjs from "dayjs";

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

const AdminTimeTablePage: React.FC = () => {
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
    setDays(prev => {
      const updated = [...prev];
      const dayIndex = updated.findIndex(d => d.day === day);

      if (dayIndex >= 0) {
        const hasEmpty = updated[dayIndex].periods.some(p => !p.startTime && !p.endTime && !p.subject && !p.teacherId);
        if (!hasEmpty) {
          updated[dayIndex].periods.push({ startTime: "", endTime: "", subject: "", teacherId: "" });
        }
      } else {
        updated.push({ day, periods: [{ startTime: "", endTime: "", subject: "", teacherId: "" }] });
      }

      return updated;
    });
  };

  const updatePeriod = (day: string, idx: number, key: keyof PeriodTime, value: string) => {
    setDays(prev =>
      prev.map(d => {
        if (d.day === day) d.periods[idx][key] = value;
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

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Admin Class Timetable</h2>

      <div className="flex gap-4 mb-4">
        <SelectInput
          label="Select Class"
          value={selectedClassId}
          onChange={handleClassSelect}
          options={classes.map(c => ({ value: c._id, label: `${c.className} - ${c.division}` }))}
        />
      </div>

      {loading && <p>Loading timetable...</p>}

      {weekDays.map(day => (
        <div key={day} className="mb-4 border p-2 rounded">
          <h3 className="font-semibold">{day}</h3>
          {days.find(d => d.day === day)?.periods.map((p, idx) => (
       <div key={idx} className="flex gap-2 mb-2">
       <TextInput
        label="Start"
        type="time"
        value={p.startTime}
       onChange={val => updatePeriod(day, idx, "startTime", val)}
      />
      <TextInput
       label="End"
       type="time"
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
))}

          <button onClick={() => addPeriod(day)} className="px-2 py-1 bg-green-500 text-white rounded">
            Add Period
          </button>
        </div>
      ))}

      <div className="flex gap-2 mt-4">
        <button onClick={handleCreateOrUpdate} className="px-4 py-2 bg-blue-600 text-white rounded">
          {timetableId ? "Update Timetable" : "Create Timetable"}
        </button>
        <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">
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
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                >
                  Edit/Update
                </button>
              )
            }
          ]}
          data={classes}
        />
      </div>
    </div>
  );
};

export default AdminTimeTablePage;
