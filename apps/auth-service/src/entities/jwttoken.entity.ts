import {Column, Entity, PrimaryColumn} from "typeorm";


@Entity()
export class jwttoken{
    @PrimaryColumn()
    user_id: number;

    @Column({nullable: false})
    token: string;
}