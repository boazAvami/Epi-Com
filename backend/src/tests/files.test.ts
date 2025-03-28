import request from "supertest";
import mongoose from "mongoose";
import { App } from "../app";
import { deleteFile } from "../utils/filesUtils";

let appInstance: App = new App();

beforeAll(async () => {
  await appInstance.initApp();
});

afterAll(async () => {
  mongoose.connection.close();
  await appInstance.close();  // Close your server instance if it's open
});

test("File upload test", async () => {
  const filePath = `${__dirname}/test_file.txt`;

  // Upload the file
  const response = await request(appInstance.app)
    .post("/files?file=test_file.txt")
    .attach("file", filePath);

  expect(response.statusCode).toBe(200);

  let url = response.body.url;

  // Extract the file route from the URL
  const fileRoute =  url.match(/\/([^/]+\.txt)$/)?.[1];

  // **Delete the file using the helper function**
  await deleteFile(fileRoute);
});