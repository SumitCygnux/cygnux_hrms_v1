import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from "typeorm";

import { Department } from "../tenant/department.entity";
import { Designation } from "../tenant/designation.entity";
import { Role } from "../tenant/roles.entity";
import { Team } from "../tenant/team.entity";

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

  @Column({ type: "uuid", nullable: false })
  departmentId!: string;

  @ManyToOne(() => Department, (department) => department.staffs)
  @JoinColumn({ name: "departmentId" })
  department!: Department;

  @Column({ type: "uuid", nullable: false })
  designationId!: string;

  @ManyToOne(() => Designation, (designation) => designation.staffs)
  @JoinColumn({ name: "designationId" })
  designation!: Designation;

  @Column({
    type: "varchar",
    default: "InActive",
  })
  status!: string;

  @Column({
    nullable: true,
  })
  role!: string;

  @Column({
    nullable: true,
  })
  accessRoleId!: string;

  @Column({
    type: "uuid",
    nullable: true,
  })
  teamId!: string;

  @ManyToOne(() => Team, (team) => team.staffs, {
    nullable: true,
  })
  @JoinColumn({
    name: "teamId",
  })
  team!: Team;

  @ManyToOne(() => Role, (role) => role.staffs)
  @JoinColumn({ name: "accessRoleId" })
  accessRole!: Role;

  @Column({
    unique: true,
      nullable: true,
  })
  employeeCode!: string;

  // Employment
  @Column({
    nullable: true,
  })
  employmentType!: string;

  // Reporting Manager
  @Column({
    nullable: true,
  })
  reportingManagerId!: number;

  @ManyToOne(() => Staff, {
    nullable: true,
  })
  @JoinColumn({
    name: "reportingManagerId",
  })
  reportingManager!: Staff;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
