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

  @Column()
  staffId!: number;
  

@ManyToOne(() => Staff, { 
  onDelete: 'CASCADE' 
})
@JoinColumn({ name: "staffId" })
staff!: Staff;

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

  @Column({
    nullable: false,
  })
  approverRole!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}