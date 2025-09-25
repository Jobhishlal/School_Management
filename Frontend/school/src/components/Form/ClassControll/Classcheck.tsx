
import { SelectInput } from "../SelectInput";

interface ClassInfoProps {
  className: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";
  setClassName: React.Dispatch<React.SetStateAction<"1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10">>;
  division: "A" | "B" | "C" | "D";
setDivision: React.Dispatch<React.SetStateAction<"A" | "B" | "C" | "D">>;
isDark?:boolean

}

export const ClassInfo: React.FC<ClassInfoProps> = ({
  className,
  setClassName,
  division,
  setDivision,
  isDark
  
}) => (
  <>
    <h3 className="font-semibold text-lg pt-4">Class Info</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
   
      <SelectInput<"1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10">
        label="Class Name"
        value={className}
        onChange={setClassName}
        options={["1","2","3","4","5","6","7","8","9","10"]}
        isDark={isDark}
      />

       <SelectInput<"A"|"B"|"C"|"D">
        label="division"
        value={division}
        onChange={setDivision}
        options={["A","B","C","D"]}
        isDark={isDark}
      />
      
    
         
    </div>
  </>
);
