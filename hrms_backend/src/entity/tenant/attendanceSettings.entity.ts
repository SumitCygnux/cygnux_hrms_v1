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

  @Column({ type: "integer", default: 15 })
  lateAfterMinutes!: number;

  @Column({ type: "decimal", precision: 4, scale: 2, default: 4.0 })
  halfDayAfterHours!: number;

  @Column({ type: "decimal", precision: 4, scale: 2, default: 6.0 })
  absentAfterHours!: number;

  @Column({ type: "decimal", precision: 4, scale: 2, default: 8.0 })
  overtimeAfterHours!: number;

  @Column({ type: "boolean", default: true })
  allowRegularization!: boolean;

  @Column({ type: "boolean", default: true })
  allowShiftChangeRequest!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
