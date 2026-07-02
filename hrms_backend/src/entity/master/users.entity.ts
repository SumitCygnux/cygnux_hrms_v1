import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("users")
export class Users {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({
    unique: true,
  })
  email!: string;

  @Column()
  password!: string;

  @Column()
  role_id!: string;

  @Column({
    nullable: true,
  })
  tenant_id!: string;

  @Column({
    nullable: true,
  })
  db_name!: string;

  @Column({
    default: true,
  })
  is_verified!: boolean;

  @Column({
    default: false,
  })
  is_deleted!: boolean;
}
