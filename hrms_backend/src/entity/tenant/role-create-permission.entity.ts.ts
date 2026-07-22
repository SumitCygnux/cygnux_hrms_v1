import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Role } from "./roles.entity";

@Entity("role_create_permissions")
export class RoleCreatePermission {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  
  @Column({
    type: "uuid",
  })
  roleId!: string;

  @ManyToOne(() => Role, {
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "roleId",
  })
  role!: Role;

  // Which role can be created
  @Column({
    type: "uuid",
  })
  allowedRoleId!: string;

  @ManyToOne(() => Role, {
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "allowedRoleId",
  })
  allowedRole!: Role;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
  
}