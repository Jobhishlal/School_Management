import bcrypt from "bcrypt";

(async () => {
  const plain = "zt67HIHT";
  const hash = await bcrypt.compare(plain, "$2b$10$BH/OzcDESOkxD4JQBuJR5.8c.x3dRxjlG60rg1h4jwpFh/J4eNgA2");
  console.log(hash);
})();