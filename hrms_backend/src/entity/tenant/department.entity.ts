import {Entity,PrimaryGeneratedColumn,Column, OneToMany} from "typeorm";
import { Staff } from "./staff.entity";

@Entity("departments")
export class Department {

  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
managerId!: string;

  @Column({
    default: 0
  })
  headcount!: number;

  @Column()
  budget!: number;

  @Column()
  openPositions!: number;

  @Column({
    default: false
  })
  is_deleted!: boolean;

  @OneToMany(() => Staff, (staff) => staff.department)
staffs!: Staff[];
}