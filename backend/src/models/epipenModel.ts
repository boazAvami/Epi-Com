// epipenModel.ts
import mongoose, { Schema, Document } from 'mongoose';
import {  Location } from '../utils/geoUtils';

export interface Contact {
  phone: string;
  name: string;
}

export interface IEpiPen extends Document {
  userId: mongoose.Types.ObjectId;
  location: Location;
  description: string;
  expiryDate: Date;
  contact: Contact;
  image: string; // Base64 or URL
  serialNumber: string;
}

const epiPenSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  description: { type: String },
  expiryDate: { type: Date, required: true },
  contact: {
    phone: { type: String, required: true },
    name: { type: String, required: true },
  },
  image: { type: String },
  serialNumber: { type: String, required: true },
});

epiPenSchema.index({ location: '2dsphere' });

export const EpiPenModel = mongoose.model<IEpiPen>('EpiPen', epiPenSchema);




export interface AddEpiPenInput {
    location: { latitude: number; longitude: number };
    description?: string;
    expiryDate: string;
    contact: { phone: string; name: string };
    image?: string;
    serialNumber: string;
  }
  
  export interface UpdateEpiPenInput {
    _id: string;
    location?: { latitude: number; longitude: number };
    description?: string;
    expiryDate?: string;
    contact?: { phone: string; name: string };
    image?: string;
    serialNumber?: string;
  }
  
  export interface DeleteEpiPenInput {
    _id: string;
  }
  
  export interface NearbyEpiPenInput {
    location: { latitude: number; longitude: number };
    radius: number;
  }