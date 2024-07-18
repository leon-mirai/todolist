import type { User } from "./types.ts";
import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const users: User[] = [];

app.get("/", function (req, res) {
  res.send("hello neegus");
});

app.post("/users/registration", function (req, res) {
  const { email, password } = req.body;
  users.push({ email, password });

  res.sendStatus(201);
});

app.post("/users/login", function (req, res) {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  const isValid = !!user;

  console.log("Login valid: ", isValid);

  res.cookie("user", email, { secure: true, httpOnly: true });
  res.send();
});

app.delete("/users/logout", function (req, res) {
  res.clearCookie("user");

  res.send();
});

app.get("/users/whoami", function (req, res) {
  // Cookies that have not been signed
  console.log("Cookies: ", req.cookies);

  // Cookies that have been signed
  console.log("Signed Cookies: ", req.signedCookies);

  const user = req.cookies.user;

  res.json({
    email: user,
  });
});

app.get("/users", function (req, res) {
  res.send(users);
});

app.listen(3000, function () {
  console.log("Server running on port 3000");
});
