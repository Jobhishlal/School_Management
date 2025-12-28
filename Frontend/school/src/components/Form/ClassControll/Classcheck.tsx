import { SelectInput } from "../SelectInput";

interface ClassOption {
  _id: string;
  className: string;
  division: string;
}
// import { getclassDivision } from "../../../services/authapi";

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

  if (mode === "selectClassId") {
    return (
      <div>
        <h3 className="font-semibold text-lg pt-4">Select Class</h3>
        <select
          value={classId}
          onChange={(e) => setClassId?.(e.target.value)}
          className={`border px-3 py-2 rounded ${isDark ? "bg-slate-800 text-white" : "bg-white text-black"
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
    <div className="space-y-4">
      <h3 className="font-semibold text-lg pt-4">Class Info</h3>
      <SelectInput
        label="Class Name"
        value={className as string}
        onChange={(val) => setClassName?.(val as any)}
        options={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
        isDark={isDark}
      />
      <div className="flex flex-col gap-2">
        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-gray-700"}`}>
          Division
        </label>
        <input
          type="text"
          value={division as string}
          onChange={(e) => setDivision?.(e.target.value as any)}
          placeholder="e.g. A, B, C, Red..."
          className={`w-full px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm
            ${isDark
              ? "bg-slate-700 border-slate-600 text-slate-100"
              : "bg-white border-gray-300 text-gray-800"
            }`}
        />
      </div>
    </div>
  );
};
