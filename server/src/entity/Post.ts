import { Entity, BaseEntity, ManyToOne, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn } from "typeorm";
import { ObjectType, Field } from "type-graphql";
import User from "./User";

@Entity({})
@ObjectType()
export class Post extends BaseEntity{
  @Field({nullable:true})
  @PrimaryGeneratedColumn()
  id: number;

  @Field({nullable:true})
  @Column()
  text: string;

  @Field(() => User, {nullable:true})
  @ManyToOne(() => User, user => user.posts)
  user: User;

  @ManyToMany(() => User, user => user.likedPosts, {})
  @JoinTable()
  likers: User[]
  
  @Field()
  likes(): number{
    return this.likers.length
  }

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamp', name: 'create_date', default: () => 'LOCALTIMESTAMP' })
  createDate: Date;
}