import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";

import { Department } from "./department.entity";
import { Staff } from "./staff.entity";

@Entity("teams")
export class Team {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    unique: true,
  })
  teamName!: string;

  @Column({
    type: "uuid",
  })
  departmentId!: string;

  @ManyToOne(() => Department, (department) => department.teams)
  @JoinColumn({ name: "departmentId" })
  department!: Department;

  @OneToMany(() => Staff, (staff) => staff.team)
  staffs!: Staff[];

  @Column({
    default: "Active",
  })
  status!: string;

  @Column({
  default: false,
})
is_deleted!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}