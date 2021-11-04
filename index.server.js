import express from "express";
import { connectDB } from "./config/database.js";

// initializing express app
const app = express();

// connecting to hosted(atlas) DB
connectDB();

// setting port number dynamically
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`server is running at ${PORT} port`));
