import { Class } from "../../domain/entities/Class";
import { ClassErrors } from "../../domain/enums/ClassError";

const allowedClasses = ["1", "2", "3", "4", "5","6","7","8","9","10"];
const allowedDivisions = ["A", "B", "C", "D"];

export function ClassValidate(classData: Class) {
  const { className, division } = classData;


  if (!className || !division) {
    throw new Error(ClassErrors.REQUIRED);
  }


  if (!allowedClasses.includes(className) || !allowedDivisions.includes(division)) {
    throw new Error(ClassErrors.INVALID_SELECTION);
  }

  return true;
}
