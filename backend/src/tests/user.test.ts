import request from 'supertest';
import mongoose from 'mongoose';
import { App } from '../app';
import { userModel } from '../models/userModel';
import {EGender, IUser} from "@shared/types";

let appInstance: App = new App();
let accessToken: string;
let userId: string;

beforeAll(async () => {
  await appInstance.initApp();
  await userModel.deleteMany();

  // Register a test user
  const registerRes = await request(appInstance.app)
    .post('/auth/register')
    .send(testUser);
  
  // Login the test user
  const loginRes = await request(appInstance.app)
    .post('/auth/login')
    .send({ email: testUser.email, password: testUser.password });
  
  accessToken = loginRes.body.accessToken;
  userId = loginRes.body._id;
});

afterAll(async () => {
  await mongoose.connection.close();
  await appInstance.close();
});

beforeEach(() => {
  jest.resetAllMocks();
});

const testUser: IUser & { password: string } = {
  userName: 'usertestUser',
  email: 'usertest@user.com',
  password: 'testUserPassword123',
  firstName: 'Test',
  lastName: 'User',
  gender: EGender.MALE,
  phone_number: '1234567890',
  allergies: ['Nuts'],
  emergencyContacts: [{ name: 'Jane Doe', phone: '0987654321' }],
};

describe('User GraphQL API', () => {
  it('should fetch the authenticated user', async () => {
    const response = await request(appInstance.app)
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ query: '{ me { userName email } }' });

    expect(response.status).toBe(200);
    expect(response.body.data.me).toHaveProperty('userName', testUser.userName);
    expect(response.body.data.me).toHaveProperty('email', testUser.email);
  });

  it('should update the user profile', async () => {
    const updatedData = {
      query: `
        mutation {
          updateUser(userName: "updatedUser", firstName: "Updated", phone_number: "1112223333") {
            userName
            firstName
            phone_number
          }
        }
      `,
    };

    const response = await request(appInstance.app)
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.data.updateUser).toHaveProperty('userName', 'updatedUser');
    expect(response.body.data.updateUser).toHaveProperty('firstName', 'Updated');
    expect(response.body.data.updateUser).toHaveProperty('phone_number', '1112223333');
  });

  it('should delete the user', async () => {
    const response = await request(appInstance.app)
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ query: 'mutation { deleteUser(id: "' + userId + '") }' });

    expect(response.status).toBe(200);
    expect(response.body.data.deleteUser).toBe(true);
  });
});
