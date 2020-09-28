import "reflect-metadata";
import { createConnection } from "typeorm";
import Express from "express";
import { ApolloServer } from "apollo-server-express";
import AuthResolver from "./graphql/resolvers/AuthResolver";
import { buildSchema } from "type-graphql";
import PostReolver from "./graphql/resolvers/PostReolver";
import UserResolver from "./graphql/resolvers/UserResolver";
import cors from 'cors';
import User from "./entity/User";
createConnection()
  .then(async () => {
    const app = Express();
    app.use(cors({
      origin: "http://localhost:3000"
    }))
    const schema = await buildSchema({
      resolvers: [AuthResolver, PostReolver, UserResolver],
    });

    const server = new ApolloServer({
      schema,
      formatError: (e) => {
          console.log(e)
          if (e.extensions.exception) return e.extensions.exception.validationErrors[0].constraints;
          return e
      },
    });

    server.applyMiddleware({ app, cors:false });

    app.listen(8800, () => console.log(8800));
    console.log(await User.findOne(10, { relations: ["likedPosts", "posts", "followers"] }))
  })
  .catch((error) => console.log(error));
