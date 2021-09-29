import "reflect-metadata";
import { createConnection } from "typeorm";
import {ApolloServer} from "apollo-server-express"
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { CONST } from "./constants/strings";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./graphql/UserResolver";
import { MyContext } from "./types";
import cookieSession from "cookie-session";

createConnection().then(async connection => {
  const app = express();
  app.use(
    cors({
      origin: ["http://localhost:3000", "https://studio.apollographql.com"],
      credentials: true,
    })
  );
  app.use(morgan("dev"));
  app.use(cookieSession({
    keys: [CONST.LONG_ACCESS_TOKEN],
    maxAge: 1000*60*60*24*3,
    secure: true,
    sameSite: "none",
  }))
  const apolloServer = new ApolloServer({
    schema: await buildSchema({resolvers: [UserResolver]}),
    context: ({req, res}): MyContext => ({req, res})
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({app});
  app.get("/", (req, res) => {
    res.send("Hello World")
  })
  app.listen(CONST.PORT, () => console.log(`Server on http://localhost:${CONST.PORT}`))
}).catch(error => console.log(error));
