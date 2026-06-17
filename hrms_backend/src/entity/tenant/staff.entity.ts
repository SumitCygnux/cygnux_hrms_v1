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

  @CreateDateColumn()
  createdAt!: Date;
}