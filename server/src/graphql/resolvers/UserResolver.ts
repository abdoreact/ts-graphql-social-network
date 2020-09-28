import { Resolver, Query, Arg, Mutation } from "type-graphql";
import User from "../../entity/User";
import { verify } from "jsonwebtoken";
import { jwtsecret } from '../../../config.json';
@Resolver()
export default class UserResolver{
  @Query(() => User)
  async user(
    @Arg("id") id: number
  ) {
    const user = await User.findOne(id, { relations: ["likedPosts", "posts", "followers"] });
    return {
      id: user.id,
      posts: user.posts,
      likedPosts: user.likedPosts,
      username: user.username,
      followerCount: user.followers.length,
      following:user.following
    }
  }
  @Mutation(() => Number)
  async follow(
    @Arg("jwt") jwt: string,
    @Arg("user") userId:number
  ): Promise<number>{
    const payload: any = verify(jwt, jwtsecret);
    const follower = await User.findOne(payload.id);
    const user = await User.findOne(userId, { relations: ['followers'] });
    if (user.followers.find(oldFollower => oldFollower.email === follower.email)) {
      user.followers = user.followers.filter(oldFollower => oldFollower.email !== follower.email)
      await user.save()
      return 0
    }
    else {
      user.followers.push(follower)
      await user.save()
      return 1
    }
  }

} 