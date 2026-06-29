import {Entity,PrimaryGeneratedColumn,Column, OneToMany, CreateDateColumn, UpdateDateColumn} from "typeorm";
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
  
 @Column({
    default: false,
  })
  is_system!: boolean;

  @Column({
    default: false,
  })
  is_deleted!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}