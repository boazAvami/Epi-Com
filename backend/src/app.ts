// app.ts
import { ApolloServer } from "apollo-server-express";
import { userResolvers } from "./resolvers/userResolvers";
import { typeDefs } from "./schema/userSchema";
import express, { Application } from 'express';
import { mergeResolvers } from '@graphql-tools/merge';
import authMiddleware from "./authentication/auth_middleware";
import bodyParser from 'body-parser';
import { authRouter } from "./authentication/auth_route";

const resolvers = mergeResolvers([userResolvers]);

export class App {
  public app: Application;
  private server: ApolloServer;

  constructor() {
    this.app = express();
    this.app.use('/auth', bodyParser.json());
    this.app.use('/auth', bodyParser.urlencoded({ extended: true }));

    this.app.use('/auth', (req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "*");
      res.header("Access-Control-Allow-Methods", "*");
      next();
    });

    this.app.use('/auth', authRouter);
    // this.app.use('/graphql', authMiddleware); 

    // Set Apollo Server configuration
    this.server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => {
        return { userId: req.params.userId };
      },
      introspection: true, // Enable introspection 
    });
  }

  public async start() {
    await this.server.start();
    this.server.applyMiddleware({ app: this.app as any });

    if (process.env.NODE_ENV === "production") {
      // Additional production settings
      this.app.listen(process.env.PORT || 8080, () => {
        console.log(`🚀 Server running in production at http://localhost:${process.env.PORT || 8080}${this.server.graphqlPath}`);
      });
    } else {
      // Development-specific settings
      this.app.listen(process.env.PORT || 4000, () => {
        console.log(`🚀 Server running in development at http://localhost:${process.env.PORT || 4000}${this.server.graphqlPath}`);
      });
    }
  }
}