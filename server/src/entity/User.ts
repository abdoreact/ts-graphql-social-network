import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, ManyToMany, ManyToOne} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Post } from "./Post";

@Entity()
@ObjectType()
export default class User extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    @Field()
    username?: string;

    @Column()
    email?: string;

    @Column()
    password?: string;

    @Field()
    error?: string;

    @Field(() => [Post])
    @OneToMany(() => Post, post => post.user)
    posts?: Array<Post>;
    
    @Field(() => [Post])
    @ManyToMany(() => Post, post => post.likers)
    likedPosts?: Post[];
    
    @OneToMany(() => User, user => user.following)
    followers?: User[];

    @ManyToOne(() => User, user => user.followers)
    @Field(() => User)
    following?: User[];
    @Field()
    followerCount?(): number {
        return this.followers.length
    }
}
