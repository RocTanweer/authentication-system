import express from "express";

// initializing express app
const app = express();

// setting port number dynamically
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`server is running at ${PORT} port`));
