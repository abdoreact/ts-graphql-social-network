import { Resolver, Query, Mutation, Arg } from "type-graphql";
import AuthResponse from "../types/AuthResponse";
import User from "../../entity/User";
import RegisterInput from "../inputs/RegisterInput";
import { hash, verify } from 'argon2';
import { sign, verify as jwtverify } from 'jsonwebtoken';
import { jwtsecret } from '../../../config.json';
import LoginInput from '../inputs/LoginInput';
import { Post } from "../../entity/Post";
@Resolver()
export default class AuthReslover {
  @Mutation(() => AuthResponse)
  async register(
    @Arg("input") { email, password, username }: RegisterInput
  ): Promise<AuthResponse>{
    const hashedPassword=await hash(password)
    const user = await User.create({ email, password:hashedPassword, username }).save();
    return {
      id: sign({ id: user.id }, jwtsecret)
    }
  }

  @Mutation(() => AuthResponse)
  async login(
    @Arg("input") { email, password }: LoginInput
  ): Promise<AuthResponse> {
    const user = await User.findOne({ email });
    
    if (!await verify(user.password, password)) {
      return {
        error:'Incorrect password.'
      }
    }

    return {
      id: sign({ id: user.id }, jwtsecret)
    }
  }

  @Query(() => User)
  async currentUser(
    @Arg("jwt", {nullable:true}) jwt:string
  ): Promise<{username:string, posts:Array<Post>, likedPosts:Array<Post>, id:number}> {
    const userid: any = jwtverify(jwt, jwtsecret)

    const user=await User.findOne(userid.id, {relations:['posts', 'likedPosts']})

    return{username:user.username, posts:user.posts, likedPosts:user.likedPosts, id:user.id}
  }
  
} 