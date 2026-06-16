import {Entity,PrimaryGeneratedColumn,Column} from "typeorm";

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
}