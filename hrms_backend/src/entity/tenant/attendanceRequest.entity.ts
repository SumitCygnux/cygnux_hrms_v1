import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("attendance_requests")
export class AttendanceRequest {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "integer", nullable: false })
  employeeId!: number;

  @Column({ type: "varchar", nullable: false })
  requestType!: string; // 

  @Column({ type: "date", nullable: false })
  requestDate!: string;

  @Column({ type: "varchar", default: "Pending" })
  status!: string; 

  @Column({ type: "text", nullable: false })
  reason!: string;

  @Column({ type: "text", nullable: true })
  approvalComment!: string | null;

  @Column({ type: "text", nullable: true })
  rejectionComment!: string | null;

  @Column({ type: "varchar", nullable: true })
  requestedBy!: string | null;

  @Column({ type: "varchar", nullable: true })
  approvedBy!: string | null;

  @Column({ type: "timestamp", nullable: true })
  approvedAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
