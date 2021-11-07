import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/functions.js";

export const userRegistration = async (req, res) => {
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
    // if(res.status)
    res.json(error.message);
  }
};

export const userLogin = async (req, res) => {
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

    const accessToken = generateAccessToken(userFromDB._id);
    const refreshToken = generateRefreshToken(userFromDB._id);

    // saving refresh token in DB for each user.refreshToken field
    userFromDB.refreshTokens.push(refreshToken);
    await userFromDB.save();

    res.status(200).set("x-access-token", accessToken).json({
      message: "You are logged in",
      userId: userFromDB._id,
      refreshToken,
    });
  } catch (error) {
    res.json(error.message);
  }
};

export const userLogout = async (req, res) => {
  try {
    // getting the required data from client
    const { refreshToken, id } = req.body;
    if (!(refreshToken && id)) {
      res.status(400);
      throw new Error("Either id or refresh token is not present");
    }
    // finding the User using that id
    const userFromDB = await User.findOne({ _id: id });
    userFromDB.refreshTokens = userFromDB.refreshTokens.filter(
      (token) => token !== refreshToken
    );
    await userFromDB.save();
  } catch (error) {
    res.json(error.message);
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    // checking if userId is a valid ObjectId
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400);
      throw new Error("Invalid ObjectId");
    }

    // we will find if there is a user in our DB
    const userExist = await User.findOne({ _id: userId });
    if (!userExist) {
      res.status(400);
      throw new Error("No user found for that `userId`");
    }

    // sending user info to the client
    res.status(200).json({ status: "success", user: userExist });
  } catch (error) {
    res.json(error.message);
  }
};

export const patchUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    // checking if userId is a valid ObjectId
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400);
      throw new Error("Invalid ObjectId");
    }
    // updating specified fields of user in the DB
    let updateQuery = {};

    Object.entries(req.body.toBeUpdated).forEach(([key, value]) => {
      if (key === "password") {
        const hashedPassword = bcrypt.hashSync(value, 10);
        updateQuery[key] = hashedPassword;
      } else {
        updateQuery[key] = value;
      }
    });
    console.log(updateQuery);
    const updatedUser = await User.updateOne(
      { _id: userId },
      { $set: updateQuery }
    );
    res.status(201).json({ message: "User updated!", updatedUser });
  } catch (error) {
    res.json(error);
  }
};

export const handleEveryrouteElse = (req, res) => {
  res.status(404).json({ message: "page not found" });
};
