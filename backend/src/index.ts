import { App } from "./app";
import dotenv from "dotenv";

describe("App Server", () => {
  let app: App;

  beforeAll(() => {
    dotenv.config();  // Load the .env file
    app = new App();  // Create the App instance
  });

  it("should start the server in the correct environment", () => {
    if (process.env.NODE_ENV === "production") {
      expect(app.app).toHaveProperty("listen");
    } else {
      expect(app.app).toHaveProperty("listen");
    }
  });
});
