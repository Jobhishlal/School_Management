export interface Subject {
  name: string;
  department: "LP" | "UP" | "HS";
}

export const DefaultSubjects: Subject[] = [

  { name: "Malayalam", department: "LP" },
  { name: "English", department: "LP" },
  { name: "Mathematics", department: "LP" },
  { name: "Environmental Studies", department: "LP" },


  { name: "Malayalam", department: "UP" },
  { name: "English", department: "UP" },
  { name: "Mathematics", department: "UP" },
  { name: "Science", department: "UP" },
  { name: "Social Science", department: "UP" },


  { name: "Malayalam", department: "HS" },
  { name: "English", department: "HS" },
  { name: "Mathematics", department: "HS" },
  { name: "Physics", department: "HS" },
  { name: "Chemistry", department: "HS" },
  { name: "Biology", department: "HS" },
  { name: "History", department: "HS" },
  { name: "Geography", department: "HS" },
];
