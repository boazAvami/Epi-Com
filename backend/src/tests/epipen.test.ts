import request from 'supertest';
import mongoose from 'mongoose';
import { App } from '../app';
import { userModel } from '../models/userModel';
import {  EpiPenKind, EpiPenModel } from '../models/epipenModel'; // Assuming you have an epiPen model
import {EGender, IUser} from '@shared/types';


let appInstance: App = new App();

beforeAll(async () => {
  await appInstance.initApp();
  await userModel.deleteMany();
  await EpiPenModel.deleteMany();

  // Register and login a test user for auth context
  await request(appInstance.app).post('/auth/register').send(testUser);
  const loginRes = await request(appInstance.app).post('/auth/login').send(testUser);
  testUser.accessToken = loginRes.body.accessToken;
  testUser.refreshToken = loginRes.body.refreshToken;
  testUser._id = loginRes.body._id;
});

afterAll(async () => {
  mongoose.connection.close();
  await appInstance.close();  // Close your server instance if it's open
});

beforeEach(() => {
  jest.resetAllMocks();
});

const testUser: IUser & { accessToken?: string; refreshToken?: string; _id?: string } = {
  userName: 'epipenTestUser',
  email: 'epipenTest@user.com',
  password: 'epipenTestUser',
  firstName: 'Test',
  lastName: 'User',
  phone_number: '0545325447',
  gender: EGender.MALE,
  allergies: ['Peanuts'],
  emergencyContacts: [{ name: 'John Doe', phone: '1234567890' }],
};

describe('EpiPen GraphQL Tests', () => {
    let testEpiPenId: string;
  
    test('Add EpiPen', async () => {
      const addEpiPenMutation = `
        mutation AddEpiPen($input: AddEpiPenInput!) {
          addEpiPen(input: $input) {
            message
          }
        }
      `;
  
      const epiPenData = {
        input: {
          location: { latitude: 40.748817, longitude: -73.985428 },
          description: 'Emergency EpiPen for allergic reactions',
          expiryDate: '2025-12-01',
          contact: { phone: '1234567890', name: 'John Doe' },
          image: 'https://example.com/epipen.jpg',
          serialNumber: 'ABC123XbYZ',
          kind: EpiPenKind.ADULT,
        },
      };
  
      const response = await request(appInstance.app)
        .post('/graphql')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({ query: addEpiPenMutation, variables: epiPenData });
  
      expect(response.statusCode).toBe(200);
    });
  
    test('Get EpiPen by ID', async () => {
      // First, add a new EpiPen to the DB
      const addEpiPenMutation = `
        mutation AddEpiPen($input: AddEpiPenInput!) {
          addEpiPen(input: $input) {
            message
            _id
          }
        }
      `;
      const epiPenData = {
        input: {
          location: { latitude: 40.748817, longitude: -73.985428 },
          description: 'Emergency EpiPen for allergic reactions',
          expiryDate: '2025-12-01',
          contact: { phone: '1234567890', name: 'John Doe' },
          image: 'https://example.com/epipen.jpg',
          serialNumber: 'ABC123XaYZ',
          kind: EpiPenKind.ADULT,
        },
      };
  
      const addResponse = await request(appInstance.app)
        .post('/graphql')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({ query: addEpiPenMutation, variables: epiPenData });
  
      expect(addResponse.statusCode).toBe(200);
      console.log(addResponse.body.data);
      // Now, get the ID of the newly created EpiPen
      const epiPenId = addResponse.body.data.addEpiPen._id;
  
      const getEpiPenQuery = `
        query GetEpiPen($id: ID!) {
          epiPenById(_id: $id) {
            _id
            serialNumber
            description
          }
        }
      `;
  
      const getResponse = await request(appInstance.app)
        .post('/graphql')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({ query: getEpiPenQuery, variables: { id: epiPenId } });
  
      expect(getResponse.statusCode).toBe(200);
      expect(getResponse.body.data.epiPenById.serialNumber).toBe('ABC123XaYZ');
      expect(getResponse.body.data.epiPenById.description).toBe('Emergency EpiPen for allergic reactions');
    });
  
    test('Update EpiPen', async () => {
      // Add a new EpiPen to update
      const addEpiPenMutation = `
        mutation AddEpiPen($input: AddEpiPenInput!) {
          addEpiPen(input: $input) {
            message
            _id
          }
        }
      `;
      const epiPenData = {
        input: {
          location: { latitude: 40.748817, longitude: -73.985428 },
          description: 'Old Description',
          expiryDate: '2025-12-01',
          contact: { phone: '1234567890', name: 'John Doe' },
          image: 'https://example.com/epipen.jpg',
          serialNumber: 'ABC123XcYZ',
          kind: EpiPenKind.ADULT,
        },
      };
  
      const addResponse = await request(appInstance.app)
        .post('/graphql')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({ query: addEpiPenMutation, variables: epiPenData });
  
      const epiPenId = addResponse.body.data.addEpiPen._id;

      // Now, update the EpiPen's description
      const updateEpiPenMutation = `
        mutation UpdateEpiPen($input: UpdateEpiPenInput!) {
          updateEpiPen(input: $input) {
            message
            _id
          }
        }
      `;
  
      const updateEpiPenData = {
        input: {
          _id: epiPenId,
          description: 'Updated Description',
        },
      };
  
      const updateResponse = await request(appInstance.app)
        .post('/graphql')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({ query: updateEpiPenMutation, variables: updateEpiPenData });
  
      expect(updateResponse.statusCode).toBe(200);
    });
  
    test('Delete EpiPen', async () => {
      // Add an EpiPen to delete
      const addEpiPenMutation = `
        mutation AddEpiPen($input: AddEpiPenInput!) {
          addEpiPen(input: $input) {
            message
            _id
          }
        }
      `;
      const epiPenData = {
        input: {
          location: { latitude: 40.748817, longitude: -73.985428 },
          description: 'EpiPen to be deleted',
          expiryDate: '2025-12-01',
          contact: { phone: '1234567890', name: 'John Doe' },
          image: 'https://example.com/epipen.jpg',
          serialNumber: 'DEF456LMcN',
          kind: EpiPenKind.ADULT,
        },
      };
  
      const addResponse = await request(appInstance.app)
        .post('/graphql')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({ query: addEpiPenMutation, variables: epiPenData });
  
      const epiPenId = addResponse.body.data.addEpiPen._id;
  
      // Now, delete the EpiPen
      const deleteEpiPenMutation = `
        mutation DeleteEpiPen($input: DeleteEpiPenInput!) {
          deleteEpiPen(input: $input) {
            message
            _id
          }
        }
      `;
  
      const deleteEpiPenData = {
        input: {
          _id: epiPenId,
        },
      };
  
      const deleteResponse = await request(appInstance.app)
        .post('/graphql')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({ query: deleteEpiPenMutation, variables: deleteEpiPenData });
  
      expect(deleteResponse.statusCode).toBe(200);
    });
  });
  
