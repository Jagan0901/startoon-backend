import express from "express";
import bcrypt from "bcrypt";
import {
  genPassword,
  createAdmin,
  getAdminByEmail,
  updateUser,
} from "../helper.js";

const router = express.Router();

// router.post("/signup", async (req, res) => {
//   const { email, password} = req.body;

//   //To set Email Pattern
//   if (
//     !/^[\w]{1,}[\w.+-]{0,}@[\w-]{2,}([.][a-zA-Z]{2,}|[.][\w-]{2,}[.][a-zA-Z]{2,})$/g.test(
//       email
//     )
//   ) {
//     res.status(400).send({ error: "Invalid Email Pattern" });
//     return;
//   }

//   const isUserExist = await getAdminByEmail(email);
//   if (isUserExist) {
//     res.status(404).send({ error: "Email already exists" });
//     return;
//   }
//   if (
//     !/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/g.test(
//       password
//     )
//   ) {
//     res.status(404).send({ error: "Password pattern does not match" });
//     return;
//   }
//   const hashedPassword = await genPassword(password);

//   const userData = {
//     email: email,
//     password: hashedPassword,
//   };
//   const create = await createAdmin(userData);
//   res.send({ message: "Created Successfully" });
// });

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userFromDB = await getAdminByEmail(email);
  if (!userFromDB) {
    res.status(404).send({ error: "Invalid Credentials" });
    return;
  }
  const storedDbPassword = userFromDB.password;
  const isPasswordMatch = await bcrypt.compare(password, storedDbPassword);
  if (!isPasswordMatch) {
    res.status(404).send({ error: "Invalid Credentials" });
    return;
  }

  res.send({ message: "Login Successful" });
});



export const adminRouter = router;
