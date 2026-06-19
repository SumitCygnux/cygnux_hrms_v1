import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("staff")
export class Staff {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fullName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  phone!: string;

  @Column()
  gender!: string;

@Column({ type: "uuid", nullable: false })
departmentId!: string;

@Column({ type: "uuid", nullable: false })
designationId!: string;

  @Column()
  dob!: Date;

  @Column()
  joiningDate!: Date;

  @Column("decimal")
  salary!: number;

  @Column("text")
  address!: string;

  @Column({ nullable: true })
password!: string;
 
  @Column({
  type: "varchar",
  default: "InActive",
})
status!: string;


  @CreateDateColumn()
  createdAt!: Date;

  @Column({
  nullable: true,
})
role!: string;

@Column({
  nullable: true,
})
accessRoleId!: string;

}
