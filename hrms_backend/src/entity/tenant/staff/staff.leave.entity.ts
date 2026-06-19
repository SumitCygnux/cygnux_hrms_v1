import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { Staff } from "../staff.entity";
@Entity("leave")
export class Leave {
  @PrimaryGeneratedColumn()
  id!: number;

@ManyToOne(() => Staff, (staff) => staff.leaves)
@JoinColumn({ name: "staffId" })
staff!: Staff;

  @Column()
  staffId!: number;

  @Column()
  leaveType!: string;

  @Column({
    type: "date",
  })
  fromDate!: Date;

  @Column({
    type: "date",
  })
  toDate!: Date;

  @Column({
    type: "text",
  })
  reason!: string;

  @Column({
    default: "PENDING",
  })
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}