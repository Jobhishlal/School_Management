

import { useEffect } from "react";
import { SelectInput } from "../SelectInput";

interface ClassOption {
  _id: string;
  className: string;
  division: string;
}
import { getclassDivision } from "../../../services/authapi";

interface ClassInfoProps {
  mode?: "selectClassId" | "newClass"; 
  classOptions?: ClassOption[];       
  classId?: string;
  setClassId?: React.Dispatch<React.SetStateAction<string>>;
  className?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";
  setClassName?: React.Dispatch<
    React.SetStateAction<"1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10">
  >;
  division?: "A" | "B" | "C" | "D";
  setDivision?: React.Dispatch<React.SetStateAction<"A" | "B" | "C" | "D">>;
  isDark?: boolean;
}

export const ClassInfo: React.FC<ClassInfoProps> = ({
  mode = "newClass",
  classOptions = [],
  classId,
  setClassId,
  className,
  setClassName,
  division,
  setDivision,
  isDark
}) => {
  useEffect(() => {
    if (mode === "newClass" && className && setDivision) {
      const fetchDivision = async () => {
        try {
          const res = await getclassDivision(className);
          const nextDivision = res.data?.data?.division; 
          if (nextDivision) setDivision(nextDivision);
        } catch (error) {
          console.error("Error fetching next division:", error);
        }
      };
      fetchDivision();
    }
  }, [mode, className, setDivision]);

  if (mode === "selectClassId") {
    return (
      <div>
        <h3 className="font-semibold text-lg pt-4">Select Class</h3>
        <select
          value={classId}
          onChange={(e) => setClassId?.(e.target.value)}
          className={`border px-3 py-2 rounded ${
            isDark ? "bg-slate-800 text-white" : "bg-white text-black"
          }`}
        >
          <option value="">Select Class</option>
          {classOptions.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.className}-{cls.division}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // default: new class creation
  return (
    <div>
      <h3 className="font-semibold text-lg pt-4">Class Info</h3>
      <SelectInput
        label="Class Name"
        value={className as string}
        onChange={setClassName}
        options={["1","2","3","4","5","6","7","8","9","10"]}
        isDark={isDark}
      />
    </div>
  );
};
