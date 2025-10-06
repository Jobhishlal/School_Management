import React, { useEffect, useState } from "react";
import { SelectInput } from "../SelectInput";
import { getclassDivision } from "../../../services/authapi";

interface ClassInfoProps {
  className: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";
  setClassName: React.Dispatch<
    React.SetStateAction<
      | "1"
      | "2"
      | "3"
      | "4"
      | "5"
      | "6"
      | "7"
      | "8"
      | "9"
      | "10"
    >
  >;
  division: "A" | "B" | "C" | "D";
  setDivision: React.Dispatch<
    React.SetStateAction<"A" | "B" | "C" | "D">
  >;
  isDark?: boolean;
}

export const ClassInfo = ({
  className,
  setClassName,
  setDivision, // we still need this to store the assigned value
  isDark
}) => {
  useEffect(() => {
    const fetchDivision = async () => {
      if (!className) return;
      try {
        const res = await getclassDivision(className); // call backend
        const nextDivision = res.data?.data?.division; // backend decides
        if (nextDivision) setDivision(nextDivision);
      } catch (error) {
        console.error("Error fetching next division:", error);
      }
    };
    fetchDivision();
  }, [className, setDivision]);

  return (
    <>
      <h3 className="font-semibold text-lg pt-4">Class Info</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectInput
          label="Class Name"
          value={className}
          onChange={setClassName}
          options={["1","2","3","4","5","6","7","8","9","10"]}
          isDark={isDark}
        />
        {/* No division selector */}
      </div>
    </>
  );
};

