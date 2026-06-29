import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

// Regularization | Missed Punch | Manual Entry | Attendance Correction |
// Clock-Out Approval | Work From Home | On Duty | Shift Change
export enum AttendanceRequestType {
  REGULARIZATION = "Regularization",
  MISSED_PUNCH = "Missed Punch",
  MANUAL_ENTRY = "Manual Entry",
  CORRECTION = "Attendance Correction",
  CLOCK_OUT_APPROVAL = "Clock-Out Approval",
  WORK_FROM_HOME = "Work From Home",
  ON_DUTY = "On Duty",
  SHIFT_CHANGE = "Shift Change",
}

@Entity("attendance_requests")
export class AttendanceRequest {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "integer", nullable: false })
  employeeId!: number;

  @Column({ type: "varchar", nullable: false })
  requestType!: string; // see AttendanceRequestType

  @Column({ type: "date", nullable: false })
  requestDate!: string;

  // Requested values to apply on approval, e.g.
  // { clockIn, clockOut, status, shiftId, breakDuration }.
  @Column({ type: "jsonb", nullable: true })
  payload!: Record<string, any> | null;

  @Column({ type: "varchar", default: "Pending" })
  status!: string;

  @Column({ type: "text", nullable: false })
  reason!: string;

  @Column({ type: "text", nullable: true })
  approvalComment!: string | null;

  @Column({ type: "text", nullable: true })
  rejectionComment!: string | null;

  @Column({ type: "varchar", nullable: true })
  requestedBy!: string | null;

  @Column({ type: "varchar", nullable: true })
  approvedBy!: string | null;

  @Column({ type: "timestamp", nullable: true })
  approvedAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
