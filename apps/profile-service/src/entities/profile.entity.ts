import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Profile{
  @PrimaryColumn({ nullable: false })
  id: number;

  @Column({nullable: true})
  name: string;

  @Column({nullable: true})
  fam: string;

  @Column({nullable: true})
  phone_number: string;
}