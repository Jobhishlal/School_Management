import bcrypt from "bcrypt";

(async () => {
  const plain = "STRONGPASS";
  const hash = await bcrypt.hash(plain, 10);
  console.log("Hash:", hash);
})();