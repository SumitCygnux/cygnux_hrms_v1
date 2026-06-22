import {Entity,PrimaryGeneratedColumn,Column, OneToMany} from "typeorm";
import { Staff } from "./staff.entity";

@Entity("designations")
export class Designation {

  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column()
  department_id!: string;
   @Column()
  baseSalary!: number;

  @Column({
    default: false
  })
  is_deleted!: boolean;

  @OneToMany(() => Staff, (staff) => staff.designation)
staffs!: Staff[];
}