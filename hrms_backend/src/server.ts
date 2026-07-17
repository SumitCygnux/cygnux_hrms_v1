import dotenv from "dotenv";
dotenv.config();

import app from "./app";

import DatabaseConnection from "./connection/postgresql.connection";
import { runMaintenanceAllTenants } from "./services/admin/attendanceMaintenance.service";
 
const PORT = process.env.PORT || 5001;

// Attendance maintenance sweeper: auto clock-out, missed-punch & absent marking.
const ATTENDANCE_SWEEP_INTERVAL_MS = 60 * 60 * 1000; // hourly

const startAttendanceSweeper = () => {
  const run = () =>
    runMaintenanceAllTenants().catch((e) =>
      console.error("Attendance maintenance sweep error:", e)
    );
  // Initial pass shortly after boot, then on a fixed interval.
  setTimeout(run, 15000);
  setInterval(run, ATTENDANCE_SWEEP_INTERVAL_MS);
};

DatabaseConnection.initialize()
  .then(async () => {
    console.log("Master Database Connected");
  

    app.listen(PORT, () => {
      console.log(`Server Running On Port ${PORT}`);
    });

    startAttendanceSweeper();
  })
  .catch((error) => {
    console.log(error);
  });