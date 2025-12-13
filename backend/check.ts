import bcrypt from "bcrypt";

(async () => {
  const plain = "jasal@123";
  const saltRounds = 10; 

  const hash = await bcrypt.hash(plain, saltRounds);
  console.log(hash);
})();
