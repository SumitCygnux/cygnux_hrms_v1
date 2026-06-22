import {Entity,PrimaryGeneratedColumn,Column, OneToMany} from "typeorm";
import { Staff } from "./staff.entity";

@Entity("roles")
export class Role {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @OneToMany(() => Staff, (staff) => staff.accessRole)
staffs!: Staff[];

}