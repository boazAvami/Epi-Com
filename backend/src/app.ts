import { ApolloServer } from "apollo-server-express";
import { userResolvers } from "./resolvers/userResolvers";
import { userTypeDefs } from "./schema/userSchema";
import express, { Application } from 'express';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import authMiddleware from "./authentication/auth_middleware";
import bodyParser from 'body-parser';
import { authRouter } from "./authentication/auth_route";
import connectDB from "./config/db";
import { epiPenResolvers } from "./resolvers/epipenResolvers";
import { epiPenTypeDefs } from "./schema/epipenSchema";
import { altairExpress } from 'altair-express-middleware';

const PORT = process.env.PORT || 4000;


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
    this.app.use('/graphql', authMiddleware); 

    const resolvers = mergeResolvers([userResolvers, epiPenResolvers]);
    const typeDefs = mergeTypeDefs([userTypeDefs, epiPenTypeDefs]); // Merge typeDefs for both schemas

    
    // Set Apollo Server configuration
    this.server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => {
        return { userId: (req as any).user?._id };
      },
      introspection: true, // Enable introspection 
    });
  }

  public async start() {
    await connectDB();
    
    await this.server.start();
    this.server.applyMiddleware({ app: this.app as any });

    // Use Altair GraphQL Client at /playground
    this.app.use('/playground', altairExpress({
      endpointURL: '/graphql',
      initialQuery: `{ me { userName } }`,
    }));
    console.log(`🎮 Playground available at http://localhost:${PORT}/playground`);


    if (process.env.NODE_ENV === "production") {
      // Additional production settings
      this.app.listen(PORT || 8080, () => {
        console.log(`🚀 Server running in production at http://localhost:${PORT || 8080}${this.server.graphqlPath}`);
      });
    } else {
      // Development-specific settings
      this.app.listen(process.env.PORT || 4000, () => {
        console.log(`🚀 Server running in development at http://localhost:${process.env.PORT || 4000}${this.server.graphqlPath}`);
      });
    }
  }
}