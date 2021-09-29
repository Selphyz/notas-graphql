import { Field } from "type-graphql";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@Entity()
export class User extends BaseEntity{
    @Field(()=>String)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field(()=>String)
    @Column()
    email: string;

    @Field(()=>String)
    @Column()
    username: string;

    @Column()
    password: string;
}
