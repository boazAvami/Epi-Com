import { ApolloServer } from "apollo-server-express";
import express, { Application } from "express";
import fs from "fs";
import https from "https";
import http from "http";
import dotenv from "dotenv";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import bodyParser from "body-parser";
import authMiddleware from "./rest/authentication/auth_middleware";
import connectDB from "./db/db";
import { authRouter } from "./rest/authentication/auth_route";
import { epiPenResolvers } from "./graphql/resolvers/epipenResolvers";
import { epiPenTypeDefs } from "./graphql/schema/epipenSchema";
import { userResolvers } from "./graphql/resolvers/userResolvers";
import { userTypeDefs } from "./graphql/schema/userSchema";
import { sosResolvers } from "./graphql/resolvers/sosResolvers";
import { sosTypeDefs } from "./graphql/schema/sosSchema";
import { chatbotResolvers } from "./graphql/resolvers/chatbotResolvers";
import { chatbotTypeDefs } from "./graphql/schema/chatbotSchema";
import { filesRouter } from "./rest/files/files_route";
import { altairExpress } from "altair-express-middleware";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || "development"; // Default to development
const HTTPS_KEY = process.env.HTTPS_KEY || undefined;
const HTTPS_CERT = process.env.HTTPS_CERT || undefined;
const USE_HTTPS = NODE_ENV === "production" && HTTPS_KEY && HTTPS_CERT; // Enable HTTPS only in production

export class App {
  public app: Application;
  private server: ApolloServer;
  private httpServer: http.Server | https.Server | null = null;

  constructor() {
    this.app = express();

    this.setupMiddlewares();
    this.setupRoutes();
    this.setupGraphQL();
  }

  private setupMiddlewares() {
    this.app.use("/auth", bodyParser.json());
    this.app.use("/auth", bodyParser.urlencoded({ extended: true }));
    this.app.use("/auth", (req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "*");
      res.header("Access-Control-Allow-Methods", "*");
      next();
    });
  }

  private setupRoutes() {
    this.app.use("/auth", authRouter);
    this.app.post("/graphql", authMiddleware);
    this.app.use("/public", express.static("public"));
    this.app.use("/files", bodyParser.urlencoded({ extended: true }));
    this.app.use("/files", filesRouter);
  }

  private setupGraphQL() {
    const resolvers = mergeResolvers([userResolvers, epiPenResolvers, sosResolvers, chatbotResolvers]);
    const typeDefs = mergeTypeDefs([userTypeDefs, epiPenTypeDefs, sosTypeDefs, chatbotTypeDefs]);

    this.server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => {
        return { userId: (req as any).user?.id };
      },
      introspection: true,
    });
  }

  public async initApp() {
    await connectDB();



    await this.server.start();
    this.server.applyMiddleware({ app: this.app });
  }

  public async start() {
    await this.initApp();


    this.app.use(
      "/playground",
      altairExpress({
        endpointURL: "/graphql",
        initialQuery: `{ me { userName } }`,
      })
    );

    if (USE_HTTPS) {
      // Read certificates from files
      const key = fs.readFileSync(HTTPS_KEY, "utf8");
      const cert = fs.readFileSync(HTTPS_CERT, "utf8");

      // Create HTTPS server
      this.httpServer = https.createServer({ key, cert }, this.app);
      console.log(`🚀 Server running with HTTPS in production at https://0.0.0.0:${PORT}${this.server.graphqlPath}`);
    } else {
      // Create HTTP server for development
      this.httpServer = http.createServer(this.app);
      console.log(`🚀 Server running in ${NODE_ENV} mode at http://0.0.0.0:${PORT}${this.server.graphqlPath}`);
    }

    // Start the server
    this.httpServer.listen(PORT);
  }

  public async close() {
    if (this.httpServer) {
      await this.httpServer.close();
    }
  }
}
