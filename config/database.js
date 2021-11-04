import mongoose from "mongoose";
import { MONGODB_URI } from "./envVar.js";

// setting up mongodb database using mongoose which is hosted at altas

// Handling error at first connecttion with database
export const connectDB = async () => {
  try {
    // EXAMPLE URI -> mongodb+srv://auth_robot:<password>@cluster0.xmqse.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
    const conn = await mongoose.connect(MONGODB_URI, {
      // analyze this in case of any error related to db
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Database is connect at ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

// Handling errors that we get after connecting to DB
mongoose.connection.on("error", (error) => {
  console.log(error);
});
