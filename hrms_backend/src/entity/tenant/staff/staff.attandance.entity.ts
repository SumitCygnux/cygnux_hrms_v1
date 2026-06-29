import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";

export enum AttendanceStatus {
  PRESENT = "Present",
  ABSENT = "Absent",
  LATE = "Late",
  HALF_DAY = "Half Day",
  ON_LEAVE = "On Leave",
  WORK_FROM_HOME = "Work From Home",
  HOLIDAY = "Holiday",
  WEEKLY_OFF = "Weekly Off",
  MISSED_PUNCH = "Missed Punch",
  ON_DUTY = "On Duty",
  BUSINESS_TRIP = "Business Trip",
}

// Clock-out approval lifecycle (used only when company requires clock-out approval).
export enum ClockOutApproval {
  AUTO = "Auto", // no approval needed; finalized immediately
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected",
}

// One break session. `start` = break begins, `end` = break ends (null while ongoing).
export interface BreakSession {
  start: Date;
  end?: Date | null;
  type?: string; // Lunch | Tea | Personal | Other
  remarks?: string | null;
}

@Entity("staff_attendance")
@Index(["staffId", "date"], { unique: true }) 
export class StaffAttendance {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "integer", nullable: false })
  staffId!: number;

  @Column({ type: "date", nullable: false })
  date!: string; 

  @Column({ type: "timestamp", nullable: true })
  clockIn!: Date | null;

  @Column({ type: "timestamp", nullable: true })
  clockOut!: Date | null;

  // Timestamp of the most recent break start while a break is ongoing (null otherwise).
  @Column({ type: "timestamp", nullable: true })
  breakIn!: Date | null;

  @Column({ type: "timestamp", nullable: true })
  breakOut!: Date | null;

  // Unlimited break sessions: { start, end, type, remarks }.
  @Column({ type: "jsonb", default: [] })
  breaks!: BreakSession[];

  @Column({
    type: "varchar",
    default: "Absent",
  })
  status!: string;

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  workingHours!: number;

  @Column({ type: "varchar", nullable: true })
  shiftId!: string | null;

  @Column({ type: "integer", default: 0 })
  lateMinutes!: number;

  @Column({ type: "integer", default: 0 })
  earlyExitMinutes!: number;

  @Column({ type: "integer", default: 0 })
  overtimeMinutes!: number;

  @Column({ type: "integer", default: 0 })
  breakDuration!: number;

  // Clock-out approval state. "Auto" when approval isn't required.
  @Column({ type: "varchar", default: ClockOutApproval.AUTO })
  clockOutApproval!: string;

  // True when the record was created/edited manually (manual entry / correction).
  @Column({ type: "boolean", default: false })
  isManual!: boolean;

  // Free-form notes / correction reason.
  @Column({ type: "text", nullable: true })
  notes!: string | null;

  // ----- Device / audit metadata -----
  @Column({ type: "varchar", nullable: true })
  ipAddress!: string | null;

  @Column({ type: "varchar", nullable: true })
  device!: string | null;

  @Column({ type: "varchar", nullable: true })
  browser!: string | null;

  @Column({ type: "boolean", default: false })
  payrollProcessed!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

