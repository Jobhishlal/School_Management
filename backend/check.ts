import bcrypt from "bcrypt";

(async () => {
  const plain = "zt67HIHT";
  const hash = await bcrypt.compare(plain, "$2b$10$BH/OzcDESOkxD4JQBuJR5.8c.x3dRxjlG60rg1h4jwpFh/J4eNgA2");
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