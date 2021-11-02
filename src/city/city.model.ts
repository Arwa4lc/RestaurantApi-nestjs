import * as mongoose from 'mongoose';

export const citySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
});

export interface City extends mongoose.Document {
  name: string;
}
