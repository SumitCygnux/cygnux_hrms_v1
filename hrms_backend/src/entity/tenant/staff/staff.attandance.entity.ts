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

  @Column({ type: "timestamp", nullable: true })
  breakIn!: Date | null;

  @Column({ type: "timestamp", nullable: true })
  breakOut!: Date | null;

  
  @Column({ type: "jsonb", default: [] })
  breaks!: Array<{
    breakOut: Date; 
    breakIn?: Date; 
  }>;

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
  overtimeMinutes!: number;

  @Column({ type: "integer", default: 0 })
  breakDuration!: number;

  @Column({ type: "boolean", default: false })
  payrollProcessed!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

