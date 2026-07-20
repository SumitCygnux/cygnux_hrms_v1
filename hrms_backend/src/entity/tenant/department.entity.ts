import {Entity,PrimaryGeneratedColumn,Column, OneToMany} from "typeorm";
import { Staff } from "./staff.entity";
import { Designation } from "./designation.entity";
import { Team } from "./team.entity";
@Entity("departments")
export class Department {

  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  
  @Column({
    default: false
  })
  is_deleted!: boolean;
  
  @OneToMany(() => Staff, (staff) => staff.department)
  staffs!: Staff[];
  
  @OneToMany(() => Designation, (designation) => designation.department)
  designations!: Designation[];
 @OneToMany(() => Team, (team) => team.department)
  teams!: Team[];
}
