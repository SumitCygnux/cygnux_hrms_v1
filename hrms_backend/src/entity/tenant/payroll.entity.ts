import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { Staff } from "./staff.entity";

@Entity("payroll")
export class Payroll {
  @PrimaryGeneratedColumn()
  id!: number;


  @Column()
  staffId!: number;

  @ManyToOne(() => Staff)
  @JoinColumn({ name: "staffId" })
  staff!: Staff;

  
  @Column("decimal")
  basicSalary!: number;

  @Column("decimal", { default: 0 })
  allowance!: number;

  @Column("decimal", { default: 0 })
  bonus!: number;

  @Column("decimal", { default: 0 })
  deduction!: number;

  @Column("decimal", { default: 0 })
  tax!: number;

  @Column("decimal")
  netSalary!: number;

  @Column()
  month!: string;

  @Column()
  year!: number;

  @Column({
    default: "Pending",
  })
  status!: string;

  @Column({
    type: "timestamp",
    nullable: true,
  })
  processedAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}