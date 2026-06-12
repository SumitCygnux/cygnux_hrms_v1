import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { AppDataSource } from "./connection/dataSource";

const PORT = process.env.PORT || 5000;

AppDataSource.initialize()
  .then(() => {

    
    console.log("Database Connected");

    app.listen(PORT, () => {
      console.log( `Server Running On Port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });