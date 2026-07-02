import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("modules")
export class Module {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    unique: true,
    length: 100,
  })
  name!: string;

  @Column({
    unique: true,
    length: 100,
  })
  identifier!: string;

  @Column({
    nullable: true,
  })
  description!: string;

  @Column({
    nullable: true,
  })
  icon!: string;

  @Column({
    nullable: true,
  })
  path!: string;

  @Column({
    default: 0,
  })
  sortOrder!: number;

  @Column({
    default: true,
  })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}