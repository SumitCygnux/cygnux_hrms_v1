import {Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,UpdateDateColumn} from "typeorm";

@Entity("companies")
export class Company {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  companyName!: string;

  @Column({ unique: true })
  companyEmail!: string;

  @Column()
  phone!: string;

  @Column()
  industry!: string;

  @Column()
  companySize!: string;

  @Column()
  country!: string;

  @Column()
  state!: string;

  @Column()
  city!: string;

  @Column()
  address!: string;

  @Column({
    default: "ACTIVE",
  })
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
