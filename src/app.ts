import { ApolloServer } from "apollo-server-express";
import { resolvers } from "./resolvers/userResolver";
import { typeDefs } from "./schema/userSchema";
import { authMiddleware } from "./middelware/auth";
import express, { Application } from 'express';  // Import express and its Application type

export class App {
    public app: Application;
    private server: ApolloServer;
  
    constructor() {
      this.app = express();
      this.app.use(authMiddleware);
  
      // Set Apollo Server configuration
      this.server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => {
            // Access the user attached to the request object by the middleware
            return { user: req.userId || null }; // Apollo Server will now pass this to all resolvers
          },
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
