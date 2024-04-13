import {client} from "./index.js"
import  bcrypt  from 'bcrypt';

export async function genPassword(password) {
  const salt = await bcrypt.genSalt(10); //bcrypt.genSalt(no of rounds)
  console.log(salt);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log(hashedPassword);
  return hashedPassword;
}
// console.log(genPassword("password"));

export async function createUser(data) {
  return await client
    .db("Startoon")
    .collection("users") 
    .insertOne(data);
}

export async function getUserByEmail(email) {
  return await client
    .db("Startoon")
    .collection("users")
    .findOne({ email: email });
}

export async function updateUser(email, data) {
  return await client
    .db("Startoon")
    .collection("users")
    .updateOne({ email: email }, { $set: data });
}


//admin
export async function createAdmin(data) {
  return await client
    .db("Startoon")
    .collection("admin") 
    .insertOne(data);
}

export async function getAdminByEmail(email) {
  return await client
    .db("Startoon")
    .collection("admin")
    .findOne({ email: email });
}



//userslist

export async function getUsers(req) {
  return await client
    .db("Startoon")
    .collection("users")
    .find(req.query)
    .toArray();
}