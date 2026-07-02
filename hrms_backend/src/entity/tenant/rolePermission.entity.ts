import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { Role } from "./roles.entity";
import { Module } from "./module.entity";

@Entity("role_permissions")
export class RolePermission {

  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Role, {
    eager: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "role_id" })
  role!: Role;

  @ManyToOne(() => Module, {
    eager: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "module_id" })
  module!: Module;

  @Column({
    type: "jsonb",
    default: {},
  })
  operations!: {
    create?: boolean;
    view?: boolean;
    update?: boolean;
    delete?: boolean;
    approve?: boolean;
    export?: boolean;
  };

  @Column({
    default: true,
  })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}