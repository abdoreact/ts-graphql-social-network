import { InputType, Field } from "type-graphql";
import { Length, MinLength, IsEmail } from "class-validator";
import { IsUserAlreadyExist } from "./decorators/IsUserAlreadyExists";

@InputType()
export default class RegisterInput{
  @Field()
  @Length(2, 30, {message:"Username's must be over two characters and less than 30."})
  username: string;

  @Field()
  @IsUserAlreadyExist({message:'Email already in use.'})
  @IsEmail(undefined, {message:'Invalid Email.'})
  email: string;

  @MinLength(8, {message:"Password's must be more than eight characters."})
  @Field()
  password: string;
} 