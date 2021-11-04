import express from "express";
import { User } from "../models/user.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!(name && username && email && password))
      return res.status(400).json({
        message: "name, username, email and password all are required",
      });
    const createUser = new User({
      name,
      username,
      email,
      password,
    });
    const createdUser = await createUser.save();
    return res.status(201).json(createdUser);
  } catch (error) {
    console.log(req.body);
    console.log(error);
    return res.status(500).json(error);
  }
});

export default router;
