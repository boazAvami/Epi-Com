import mongoose, { Schema, Document } from 'mongoose';

export interface ISOS extends Document {
  userId: mongoose.Types.ObjectId;
  location: { latitude: number; longitude: number };
  status: 'active' | 'responded' | 'stopped';
  responders: mongoose.Types.ObjectId[];
  notifiedUserIds: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const sosSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  status: { type: String, enum: ['active', 'responded', 'stopped'], default: 'active' },
  responders: { type: [Schema.Types.ObjectId], ref: 'User', default: [] },
  notifiedUserIds: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  createdAt: { type: Date, default: Date.now },
});

export const SOSModel = mongoose.model<ISOS>('SOS', sosSchema);
