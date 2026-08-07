import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"; 

@Entity("attendance_settings")
export class AttendanceSettings {
  @PrimaryColumn({ type: "integer", default: 1 })
  id!: number;

  // Employee Requests
  @Column({ type: "boolean", default: true })
  allowRegularization!: boolean;

  @Column({ type: "boolean", default: true })
  allowShiftChangeRequest!: boolean;

  // Attendance Approval
  @Column({ type: "boolean", default: false })
  requireClockOutApproval!: boolean;

  // Automation
  @Column({ type: "boolean", default: true })
  autoClockOutEnabled!: boolean;

  @Column({ type: "boolean", default: true })
  autoMarkAbsent!: boolean; 

  @Column({ type: "boolean", default: false })
  captureIpAddress!: boolean;

  @Column({ type: "boolean", default: false })
  captureDeviceInfo!: boolean;

  @Column({ type: "boolean", default: false })
  allowEarlyClockIn!: boolean;

  @Column({ type: "integer", default: 30 })
  earlyClockInMinutes!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
