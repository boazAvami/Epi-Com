import request from "supertest";
import mongoose from "mongoose";
import { userModel } from "../models/userModel";
import bcrypt from 'bcrypt';
import { App } from "../app";
import {IUser} from "@shared/types";

let appInstance: App = new App();

beforeAll(async () => {
  await appInstance.initApp();
  await userModel.deleteMany();

  // Register and login the test user
  await request(appInstance.app).post("/auth/register").send(testUser2);
  const loginRes2 = await request(appInstance.app).post("/auth/login").send(testUser2);
  testUser2.accessToken = loginRes2.body.accessToken;
  testUser2.refreshToken = loginRes2.body.refreshToken;
  testUser2._id = loginRes2.body._id;
});

afterAll(async () => {
  mongoose.connection.close();
  await appInstance.close();  // Close your server instance if it's open
});

beforeEach(() => {
  jest.resetAllMocks();
});

const baseUrl = "/auth";

const testUser: IUser & { accessToken?: string; refreshToken?: string; _id?: string } = {
  userName: "sagiezra",
  email: "test@user.com",
  password: "testpassword",
  firstName: "sagi",
  lastName: "ezra",
  phone_number: "0545325447",
  allergies: ["Peanuts", "Gluten"],
  emergencyContacts: [{ name: "John Doe", phone: "1234567890" }],
};

const testUser2: IUser & { accessToken?: string; refreshToken?: string; _id?: string } = {
  userName: "testUser2",
  email: "test@user2.com",
  password: "testpassword2",
  allergies: [],
  emergencyContacts: [],
};

describe("Auth Tests", () => {
  test("Successful Auth Register", async () => {
    const response = await request(appInstance.app).post(baseUrl + "/register").send(testUser);
    expect(response.statusCode).toBe(201);
  });

  test("Auth Register Fails with Invalid Data", async () => {
    const response = await request(appInstance.app).post(baseUrl + "/register").send({ email: "invalidemail" });
    expect(response.statusCode).toBe(500);
  });

  test("Auth Register Fails when bcrypt.hash throws an error", async () => {
    jest.spyOn(bcrypt, "hash").mockRejectedValue(new Error("Hashing error"));
    const response = await request(appInstance.app).post(baseUrl + "/register").send(testUser);
    expect(response.statusCode).toBe(500);
    jest.restoreAllMocks();
  });

  test("Successful Auth Login", async () => {
    const response = await request(appInstance.app).post(baseUrl + "/login").send(testUser);
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    testUser.accessToken = response.body.accessToken;
    testUser.refreshToken = response.body.refreshToken;
  });

  test("Login Fails with Incorrect Password", async () => {
    const response = await request(appInstance.app).post(baseUrl + "/login").send({
      email: testUser.email,
      password: "wrongpassword",
    });
    expect(response.statusCode).not.toBe(200);
  });

  test("Refresh Token Works", async () => {
    const response = await request(appInstance.app).post(baseUrl + "/refreshToken").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
  });

  test("Refresh Token Fails with Invalid Token", async () => {
    const response = await request(appInstance.app).post(baseUrl + "/refreshToken").send({ refreshToken: "invalidToken" });
    expect(response.statusCode).toBe(500);
  });

  test("Login Handles Null refreshToken Array", async () => {
    const user = await userModel.create({
      userName: "testUser3",
      email: "test3@user.com",
      password: await bcrypt.hash("password123", 10),
      refreshToken: null,
    });

    const response = await request(appInstance.app).post(baseUrl + "/login").send({
      email: user.email,
      password: "password123",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.refreshToken).toBeDefined();
    const updatedUser = await userModel.findById(user._id);
    expect(updatedUser?.refreshToken).toContain(response.body.refreshToken);
  });
});
