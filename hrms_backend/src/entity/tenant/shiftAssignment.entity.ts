import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("shift_assignments")
export class ShiftAssignment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "integer", nullable: false })
  employeeId!: number;

  @Column({ type: "varchar", nullable: false })
  shiftId!: string;

  @Column({ type: "date", nullable: false })
  effectiveFrom!: string;

  @Column({ type: "date", nullable: true })
  effectiveTo!: string | null;

  @Column({ type: "varchar", default: "Active" })
  status!: string;

  @Column({ type: "varchar", nullable: true })
  assignedBy!: string | null;

  @Column({ type: "text", nullable: true })
  remarks!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
