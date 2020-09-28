import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export default class AuthResponse{
  @Field(() => ID, {nullable:true})
  id?: string;

  @Field({nullable:true})
  error?: string;
}