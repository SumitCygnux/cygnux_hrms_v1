import {Entity,PrimaryGeneratedColumn,Column, OneToMany} from "typeorm";
import { Staff } from "./staff.entity";
import { Designation } from "./designation.entity";
@Entity("departments")
export class Department {

  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

// total employee can work in this department

  @Column({
    default: false
  })
  is_deleted!: boolean;

  @OneToMany(() => Staff, (staff) => staff.department)
staffs!: Staff[];

 @OneToMany(() => Designation, (designation) => designation.department)
  designations!: Designation[];
}
