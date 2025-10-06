import bcrypt from "bcrypt";

(async () => {
  const plain = "p4mzVaae";
  const hash = await bcrypt.compare(plain, "$2b$10$qppHeKBVfVuM7j7giN6yr.Lrxm112yyBh2eqIm6YEKFudeUaJ6N2y");
  console.log(hash);
})();


// interface ParentInterface {
//   id: string;
//   name: string;
//   contactNumber: string;
//   whatsappNumber: string;

//   email?: string;
//   relationship: "Son" | "Daughter";
// }

// interface AddressInterface {
//   id: string;
//   street: string;
//   city: string;
//   state: string;
//   pincode: string;
// }

// interface ClassInterface {
//   id: string;
//   className: string;
//   division: string;
//   department: "LP" | "UP" | "HS";
//   rollNumber: string;
//   subjects: string[];
// }