import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Staff } from "./staff.entity";
import { Department } from "./department.entity";

@Entity("designations")
export class Designation {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @ManyToOne(() => Department, (department) => department.designations)
  @JoinColumn({ name: "department_id" }) 
  department!: Department;

  @Column({
    default: false,
  })
  is_deleted!: boolean;

  @OneToMany(() => Staff, (staff) => staff.designation)
  staffs!: Staff[];
}
