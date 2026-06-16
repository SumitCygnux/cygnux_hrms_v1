import {Entity,PrimaryGeneratedColumn,Column} from "typeorm";

@Entity("roles")
export class Roles {

  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    unique: true,
  })
  name!: string;

  @Column({
    default: false,
  })
  is_deleted!: boolean;
}