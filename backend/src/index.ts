import "dotenv/config";
import { app } from "./app.js";
import { connectDB } from "./db/index.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT || 8000}`);
    });
  })
  .catch((err: Error) => {
    console.log("Postgres Database connection failed !!! ", err);
  });
