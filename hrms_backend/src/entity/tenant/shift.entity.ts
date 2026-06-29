import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

// General | Morning | Evening | Night | Flexible | Rotational
export enum ShiftType {
  GENERAL = "General",
  MORNING = "Morning",
  EVENING = "Evening",
  NIGHT = "Night",
  FLEXIBLE = "Flexible",
  ROTATIONAL = "Rotational",
}

@Entity("shifts")
export class Shift {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", nullable: false })
  shiftName!: string;

  @Column({ type: "varchar", unique: true, nullable: false })
  shiftCode!: string;

  @Column({ type: "varchar", default: ShiftType.GENERAL })
  shiftType!: string;

  @Column({ type: "varchar", nullable: false })
  startTime!: string;

  @Column({ type: "varchar", nullable: false })
  endTime!: string;

  @Column({ type: "integer", default: 0 })
  breakMinutes!: number;

  @Column({ type: "integer", default: 0 })
  graceMinutes!: number;

  @Column({ type: "decimal", precision: 4, scale: 2, default: 8.0 })
  requiredHours!: number;

  // Minimum working hours below which the day is treated as not a full day.
  @Column({ type: "decimal", precision: 4, scale: 2, default: 8.0 })
  minWorkingHours!: number;

  @Column({ type: "varchar", nullable: true })
  halfDayAfter!: string;

  @Column({ type: "varchar", nullable: true })
  absentAfter!: string;

  // ----- Late / Early-exit / Overtime rules -----
  // Leaving this many minutes (or more) before shift end flags an early exit.
  @Column({ type: "integer", default: 0 })
  earlyExitMinutes!: number;

  // Per-shift overtime threshold (hours). Falls back to global settings when null.
  @Column({ type: "decimal", precision: 4, scale: 2, nullable: true })
  overtimeAfterHours!: number | null;

  // ----- Auto clock-out -----
  @Column({ type: "boolean", default: false })
  autoClockOut!: boolean;

  // Minutes after shift end at which an open record is auto clocked out.
  @Column({ type: "integer", default: 0 })
  autoClockOutAfterMinutes!: number;

  // Shift spans midnight (e.g. night shift 22:00 -> 06:00).
  @Column({ type: "boolean", default: false })
  crossMidnight!: boolean;

  @Column({ type: "varchar", default: "Sunday" })
  weeklyOff!: string;

  // Multiple / custom weekly offs as day-of-week numbers (0 = Sunday ... 6 = Saturday).
  // Takes precedence over `weeklyOff` when non-empty.
  @Column({ type: "jsonb", default: [] })
  weeklyOffDays!: number[];

  // none | all | 1st | 2nd | 3rd | 4th | 1st_3rd | 2nd_4th | 1st_4th
  @Column({ type: "varchar", default: "none" })
  saturdayPolicy!: string;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
