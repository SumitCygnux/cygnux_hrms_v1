import dotenv from "dotenv";
dotenv.config();

import app from "./app";

import DatabaseConnection from "./connection/postgresql.connection";


const PORT = process.env.PORT || 5001;



DatabaseConnection.initialize()
  .then(async () => {
    console.log("Master Database Connected");
  

    app.listen(PORT, () => {
      console.log(`Server Running On Port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });