import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("shifts")
export class Shift {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", nullable: false })
  shiftName!: string;

  @Column({ type: "varchar", unique: true, nullable: false })
  shiftCode!: string;

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

  @Column({ type: "varchar", nullable: true })
  halfDayAfter!: string;

  @Column({ type: "varchar", nullable: true })
  absentAfter!: string;

  @Column({ type: "varchar", default: "Sunday" })
  weeklyOff!: string;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
