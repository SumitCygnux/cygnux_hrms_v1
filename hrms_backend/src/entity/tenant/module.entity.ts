import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
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

 @ManyToOne(
    () => Module,
    (module) => module.children,
    {
      nullable: true,
      onDelete: "SET NULL",
    }
  )
  @JoinColumn({
    name: "parentId",
  })
  parent!: Module | null;

  @OneToMany(
    () => Module,
    (module) => module.parent
  )
  children!: Module[];
  
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
