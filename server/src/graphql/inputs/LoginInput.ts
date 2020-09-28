import { InputType, Field } from "type-graphql";
import { Length, MinLength, IsEmail } from "class-validator";
import {IsNotUserAlreadyExist} from './decorators/IsNotUserAlreadyExists'

@InputType()
export default class LoginInput{

  @Field()
  @IsNotUserAlreadyExist({message:'Email not in use.'})
  @IsEmail(undefined, {message:'Invalid Email.'})
  email: string;

  @MinLength(8, {message:"Password's must be more than eight characters."})
  @Field()
  password: string;
} 