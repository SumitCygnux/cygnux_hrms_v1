import {Entity,PrimaryGeneratedColumn,Column,CreateDateColumn} from "typeorm";

@Entity("tenant_dbs")
export class Tenant_dbs {

  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  company_email!: string;

  @Column()
  phone!: string;

  @Column()
  industry!: string;

  @Column()
  company_size!: string;

  @Column()
  country!: string;

  @Column()
  state!: string;

  @Column()
  city!: string;

  @Column("text")
  address!: string;

  @Column({
    unique: true,
  })
  subdomain!: string;

  @Column({
    unique: true,
  })
  db_name!: string;

  @Column({
    default: true,
  })
  is_active!: boolean;

  @CreateDateColumn()
  created_at!: Date;
}