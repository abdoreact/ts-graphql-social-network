import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Post } from "../../entity/Post";
import { verify } from 'jsonwebtoken';
import { jwtsecret } from '../../../config.json'
import User from "../../entity/User";
@Resolver()
export default class PostReolver{
  @Query(() => [Post])
  async posts() : Promise<Array<Post>>{
    return await (await Post.find({ relations:['user', 'likers'], order:{createDate:"DESC"} }))
  }

  @Mutation(() => Post)
  async post(
    @Arg("jwt") jwt: string,
    @Arg("body")  body: string
  ){
    const payload: any = verify(jwt, jwtsecret)
    const author=await User.findOne(payload.id)
    const post = Post.create({ text: body, user: author })
    await post.save()
    return {
      id:post.id,
      user: {
        username: author.username,
        id:author.id
      },
      text:post.text
    }
  }

  @Mutation(() => Number)
  async like(
    @Arg("jwt") jwt: string,
    @Arg("post") postId: number
  ): Promise<number> {
    const post = await Post.findOne(postId, {relations:['likers']});
    const payload: any = verify(jwt, jwtsecret)
    const user = await User.findOne(payload.id);
    console.log(post)
    if (post.likers.find(liker => liker.email === user.email)) {
      post.likers = post.likers.filter(liker => liker.email !== user.email)
      await post.save()
      return -1
    }
    else {
      post.likers.push(user)
      await post.save()
      return 1
    }
  }
  @Mutation(() => Boolean)
  async deletePost(
    @Arg("jwt") jwt: string,
    @Arg("post") postId: number
  ): Promise<boolean> {
    const payload: any = verify(jwt, jwtsecret);
    const post = await Post.findOne(postId, {relations:['user']});
    const user=await User.findOne(payload.id)
    if (post.user.email === user.email) {
      await post.remove()
      return true
    }
    else {
      return false
    }
  }
  @Query(() => Post)
  async getPost(
    @Arg("id") id:number
  ){
    const post = await Post.findOne(id, { relations: ['user', 'likers']});
    return {
      id: post.id,
      text: post.text,
      user: {
        username: post.user.username,
        id:post.user.id
      },
      likes:post.likers.length
    }
  }
}