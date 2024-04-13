import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { genPassword, createUser, getUserByEmail, updateUser, getUsers } from "../helper.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password, name, gender } = req.body;

  if (!name) return res.status(400).send({ error: "Enter Name" });
  if (!gender) return res.status(400).send({ error: "Choose gender" });

  //To set Email Pattern
  if (
    !/^[\w]{1,}[\w.+-]{0,}@[\w-]{2,}([.][a-zA-Z]{2,}|[.][\w-]{2,}[.][a-zA-Z]{2,})$/g.test(
      email
    )
  ) {
    res.status(400).send({ error: "Invalid Email Pattern" });
    return;
  }

  const isUserExist = await getUserByEmail(email);
  if (isUserExist) {
    res.status(404).send({ error: "Email already exists" });
    return;
  }
  if (
    !/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/g.test(
      password
    )
  ) {
    res.status(404).send({ error: "Password pattern does not match" });
    return;
  }
  const hashedPassword = await genPassword(password);

  const userData = {
    name: name,
    email: email,
    password: hashedPassword,
    gender: gender,
    count: 0,
    lastLoggedIn: "",
  };
  const create = await createUser(userData);
  res.send({ message: "Created Successfully" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  //   console.log(email, password);
  const userFromDB = await getUserByEmail(email);
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

  const count = userFromDB.count + 1;

  // Create a new Date object
const currentDate = new Date();

// Get the current date
const date = currentDate.getDate();

// Get the current month (Note: January is 0)
const month = currentDate.getMonth() + 1;

// Get the current year
const year = currentDate.getFullYear();

// Get the current hours
const hours = currentDate.getHours();

// Get the current minutes
const minutes = currentDate.getMinutes();

// Get the current seconds
const seconds = currentDate.getSeconds();

// Format the output
const lastLoggedIn = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;

// console.log("Current Date and Time: " + currentTime);

//   const lastLoggedIn = new Date();

  const userData = {
    name: userFromDB.name,
    email: userFromDB.email,
    password: storedDbPassword,
    gender: userFromDB.gender,
    count: count,
    lastLoggedIn: lastLoggedIn,
  };

  const update = await updateUser(email, userData);
  if (!update)
    return res.status(400).send({ error: "Error occurred while updating..." });

  res.send({
    message: "Login Successful",
    name: userFromDB.name,
    email: userFromDB.email,
    password: password,
    gender: userFromDB.gender,
    count: count,
    lastLoggedIn: lastLoggedIn,
  });
});

router.get("/", async (req, res) => {
  const { name,email } = req.query;
  
  const usersList = await getUsers(req);
  res.send(usersList);
});

export const usersRouter = router;
