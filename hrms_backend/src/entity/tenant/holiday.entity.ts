import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";

// National | State | Company | Branch | Festival
export enum HolidayType {
  NATIONAL = "National",
  STATE = "State",
  COMPANY = "Company",
  BRANCH = "Branch",
  FESTIVAL = "Festival",
}

@Entity("holidays")
@Index(["holidayDate"])
export class Holiday {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", nullable: false })
  holidayName!: string;

  // Not unique: multiple branch/department-scoped holidays may share a date.
  @Column({ type: "date", nullable: false })
  holidayDate!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ type: "varchar", default: HolidayType.COMPANY })
  holidayType!: string;

  @Column({ type: "varchar", nullable: true })
  branch!: string | null;

  @Column({ type: "uuid", nullable: true })
  departmentId!: string | null;

  @Column({ type: "boolean", default: false })
  isRecurring!: boolean;

  @Column({ type: "boolean", default: true })
  isPaid!: boolean;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
