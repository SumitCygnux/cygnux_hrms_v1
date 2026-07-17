import express from "express";
import cors from "cors";
import routes from "./routes";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", routes);

app.get("/test", (req, res) => {
  res.send("Server Running");
});


export default app;