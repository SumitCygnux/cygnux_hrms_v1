import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("leave_policy")
export class LeavePolicy {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  leaveType!: string;

  @Column({ type: "int", nullable: true })
  annualLimit!: number;

  @Column({ default: false })
  isUnlimited!: boolean;

  @Column({ default: false })
  carryForward!: boolean;

  @Column({
    default: "Yearly",
  })
  accrualCycle!: string;

  @Column({
    default: true,
  })
  status!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}