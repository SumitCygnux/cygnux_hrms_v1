import {Entity,PrimaryGeneratedColumn,Column} from "typeorm";

@Entity("departments")
export class Department {

  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  manager!: string;

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
}