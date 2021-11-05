import express from "express";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    // checking if the same user exist in the database
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      res.status(400);
      throw new Error("User already exists");
    }
    // hashing the plaintext password
    const hashed_password = await bcrypt.hash(password, 10);
    // creating the new User instance and saving it to DB
    const createUser = new User({
      name,
      username,
      email,
      password: hashed_password,
    });
    await createUser.save();
    res.status(201).json({ message: "You are registered" });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    // checking if user with that username exist
    const userFromDB = await User.findOne({ username });
    if (!userFromDB) {
      res.status(400);
      throw new Error("No User exists with that username");
    }
    // comparing the password with password in db
    const passwordMatches = await bcrypt.compare(password, userFromDB.password);
    if (!passwordMatches) {
      res.status(400);
      throw new Error("Incorrect password");
    }
    res.status(200).json({ message: "You are logged in" });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

export default router;
