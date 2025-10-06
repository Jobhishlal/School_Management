import bcrypt from "bcrypt";

(async () => {
  const plain = "123456";
  const hash = await bcrypt.compare(plain, "$2b$10$O0EbPE9CrjF7HlxoLgm6aOosewL1o/nBfrnlNiVa2C9gVn6XULI1y");
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