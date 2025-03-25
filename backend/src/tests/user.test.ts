import request from "supertest";
import { App } from "../app"; // Assuming your app is correctly exported

describe("User Authentication, Update, and Deletion", () => {
  let app: App;
  let userId: string;
  let authToken: string;

  beforeAll(async () => {
    app = new App();   // Instantiate the App class
    await app.start(); // Start the app before running tests

    // Register a new user for testing the login, update, and delete functionalities
    const res = await request(app.app).post("/graphql").send({
      query: `
        mutation {
          register(username: "testuser", email: "test@test.com", password: "123456", phone: "1234567890", allergies: ["peanuts"], emergencyContacts: [{name: "John Doe", phone: "9876543210"}]) {
            token
            user { id username email }
          }
        }
      `
    });


    userId = res.body.data.user.id;
    authToken = res.body.data.token;
  });

  it("should register a user", async () => {
    const res = await request(app.app).post("/graphql").send({
      query: `
        mutation {
          register(username: "newuser", email: "newuser@test.com", password: "123456", phone: "1234567890", allergies: ["milk"], emergencyContacts: [{name: "Jane Doe", phone: "1234567890"}]) {
            token
            user { id username email }
          }
        }
      `
    });
    expect(res.body.data.user.username).toBe("newuser");
    expect(res.body.data.user.email).toBe("newuser@test.com");
  });

  it("should login the user", async () => {
    const res = await request(app.app).post("/graphql").send({
      query: `
        mutation {
          login(email: "test@test.com", password: "123456") {
            token
            user { id username email }
          }
        }
      `
    });

    expect(res.body.data.login.user.username).toBe("testuser");
    expect(res.body.data.login.user.email).toBe("test@test.com");
    expect(res.body.data.login.token).toBeDefined();  // Ensure the token is returned
  });

  it("should update a user's profile", async () => {
    const res = await request(app.app)
      .post("/graphql")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        query: `
          mutation {
            updateUser(username: "updateduser", email: "updateduser@test.com", phone: "1112223333", allergies: ["gluten"], emergencyContacts: [{name: "Updated Contact", phone: "5555555555"}]) {
              id
              username
              email
              phone
              allergies
              emergencyContacts {
                name
                phone
              }
            }
          }
        `
      });

    expect(res.body.data.updateUser.username).toBe("updateduser");
    expect(res.body.data.updateUser.email).toBe("updateduser@test.com");
    expect(res.body.data.updateUser.phone).toBe("1112223333");
    expect(res.body.data.updateUser.allergies).toContain("gluten");
    expect(res.body.data.updateUser.emergencyContacts[0].name).toBe("Updated Contact");
  });

  it("should delete a user", async () => {
    const res = await request(app.app)
      .post("/graphql")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        query: `
          mutation {
            deleteUser(id: "${userId}") 
          }
        `
      });

    expect(res.body.data.deleteUser).toBe(true);  // Ensure the user is deleted
  });

  afterAll(async () => {
    // Optionally, clean up or disconnect after tests
  });
});
