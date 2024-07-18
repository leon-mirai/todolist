/*
Create class called UsersDB
add create method -> db.create
Push new user into array and whenever pushed also writes state of map to disk
If user.json file exists load it into state, else create an empty map



*/
import { existsSync, writeFile, readFile } from "node:fs";
import { User } from "./types.ts";

export class UserDB {
  // constructor(filename: string) {
  //   if (existsSync('/')) {
  //     console.log('The path exists');
  //   } else {
  //     console.log('No path');
  //   }
  _db;
  constructor(filename: string) {
    this._db = new Map<string, User>();
    if (existsSync(filename)) {
      console.log("The path exists");

      readFile(filename, "utf8", (err, data) => {
        if (err) throw err;
        const users = JSON.parse(data);

        for (const user of users) {
          console.log(user);
          this.create(user);
        }
      });
    } else {
      console.log("No path");
    }
  }
  // userdb.has({email, password})

  checkCredentials(user: User) {
    const dbUser = this._db.get(user.email);
    if (dbUser === undefined) {
      return false;
    }

    if (dbUser.password === user.password) {
      return true;
    }

    return false;
  }

  get users() {
    return Array.from(this._db.values());
  }

  create(user: User) {
    this._db.set(user.email, user);
    const data = JSON.stringify(Array.from(this._db.values()));
    writeFile("users.json", data, (err) => {
      if (err) throw err;
      console.log(`${user.email} has been added`);
    });
  }

  delete(email: string) {
    this._db.delete(email);
    const data = JSON.stringify(Array.from(this._db.values()));
    writeFile("users.json", data, (err) => {
      if (err) throw err;
      console.log(`${email} has been deleted.`);
    });
  }
}
// if file exists => load it as the data for new map
