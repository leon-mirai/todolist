// import type { User } from "./types.ts";
import express from "express";
import cookieParser from "cookie-parser";
import { UserDB } from "./db.ts";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //
app.use(cookieParser());

// const users: User[] = [];
// userdb is a class UserDB, which is passed the json file user.json
// initialise user database with data from users.json fiel
const userdb = new UserDB("users.json");

app.get("/", function (req, res) {
  res.send("hello ");
});

app.post("/users/registration", function (req, res) {
  // Destructure req.body to extract email and password. email and passwords are requests
  const { email, password } = req.body;

  // users.push({ email, password });
  // creates user inputted email, password
  userdb.create({ email, password }); 

  res.sendStatus(201);
});

app.post("/users/login", function (req, res) {
  const { email, password } = req.body;
  // 
  const user = userdb.checkCredentials({ email, password });
  // const user = users.find((u) => u.email === email && u.password === password);
  const isValid = !!user;

  console.log("Login valid: ", isValid);
  // give authentication cookie to user based on email request
  res.cookie("user", email, { secure: true, httpOnly: true });
  res.send();
});

app.get("/users/logout", function (req, res) {
  res.clearCookie("user"); // removes the user's session
  res.send();
});

app.delete("/users/delete", function (req, res) {
  const { email } = req.body; // destructure req.body to extract email
  userdb.delete(email); // delete the user which is identified by email from database
  res.send();
});

app.get("/users/whoami", function (req, res) {
  // Cookies that have not been signed
  console.log("Cookies: ", req.cookies); 

  // Cookies that have been signed
  console.log("Signed Cookies: ", req.signedCookies);

  const user = req.cookies.user; // get user email from cookie

  res.json({ // respond with the user email in JSON format
    email: user, 
  });
});

app.get("/users", function (req, res) {
  res.send(userdb.users);
});

app.listen(3000, function () {
  console.log("Server running on port 3000");
});
