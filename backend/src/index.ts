// require('dotenv').config({path: './env'})
import dotenv from "dotenv";
import { app } from "./app.ts";
import { connectDB } from "./db/index.ts";
dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err: Error) => {
    console.log("Postgres Database connection failed !!! ", err);
  });
