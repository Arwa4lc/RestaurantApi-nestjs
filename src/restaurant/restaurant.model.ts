import * as mongoose from 'mongoose';

export const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    trim: true,
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true,
  },
  location: {
    type: {
      type: String,
      default: 'Point',
      required: true,
    },
    coordinates: [
      // long came 1st
      {
        type: Number,
        required: true,
      },
    ],
  },
});

restaurantSchema.index({ location: '2dsphere' });

export interface Restaurant extends mongoose.Document {
  name: string;
  email: string;
  image: string;
  city: string;
  location: {
    type: string;
    coordinates: number[];
  };
}
