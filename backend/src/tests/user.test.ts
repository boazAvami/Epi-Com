import request from "supertest";
import { App } from "../app"; // Assuming your app is correctly exported

describe("User Authentication, Update, and Deletion", () => {
  let app: App;
  let userId: string;
  let authToken: string;

  beforeAll(async () => {
    app = new App();
    await app.start();

    // Register a new user for testing the login, update, and delete functionalities
    const res = await request(app.app).post("/graphql").send({
      query: `
        mutation {
          register(
            userName: "testuser", 
            email: "test@test.com", 
            password: "123456", 
            phone_number: "1234567890", 
            allergies: ["peanuts"], 
            emergencyContacts: [{name: "John Doe", phone: "9876543210"}]
          ) {
            token
            user { 
              id 
              userName 
              email 
            }
          }
        }
      `,
    });

    userId = res.body.data.register.user.id;
    authToken = res.body.data.register.token;
  });

  it("should register a user", async () => {
    const res = await request(app.app).post("/graphql").send({
      query: `
        mutation {
          register(
            userName: "newuser", 
            email: "newuser@test.com", 
            password: "123456", 
            phone_number: "1234567890", 
            allergies: ["milk"], 
            emergencyContacts: [{name: "Jane Doe", phone: "1234567890"}]
          ) {
            token
            user { 
              id 
              userName 
              email 
            }
          }
        }
      `,
    });
    expect(res.body.data.register.user.userName).toBe("newuser");
    expect(res.body.data.register.user.email).toBe("newuser@test.com");
  });

  it("should login the user", async () => {
    const res = await request(app.app).post("/graphql").send({
      query: `
        mutation {
          login(email: "test@test.com", password: "123456") {
            token
            user { 
              id 
              userName 
              email 
            }
          }
        }
      `,
    });

    expect(res.body.data.login.user.userName).toBe("testuser");
    expect(res.body.data.login.user.email).toBe("test@test.com");
    expect(res.body.data.login.token).toBeDefined();
  });

  it("should update a user's profile", async () => {
    const res = await request(app.app)
      .post("/graphql")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        query: `
          mutation {
            updateUser(
              userName: "updateduser", 
              email: "updateduser@test.com", 
              phone_number: "1112223333", 
              allergies: ["gluten"], 
              emergencyContacts: [{name: "Updated Contact", phone: "5555555555"}]
            ) {
              id
              userName
              email
              phone_number
              allergies
              emergencyContacts {
                name
                phone
              }
            }
          }
        `,
      });

    expect(res.body.data.updateUser.userName).toBe("updateduser");
    expect(res.body.data.updateUser.email).toBe("updateduser@test.com");
    expect(res.body.data.updateUser.phone_number).toBe("1112223333");
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
        `,
      });

    expect(res.body.data.deleteUser).toBe(true);
  });

  afterAll(async () => {
    // Optionally, clean up or disconnect after tests
  });
});