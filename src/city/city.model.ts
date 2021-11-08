import * as mongoose from 'mongoose';

export const citySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
});

citySchema.set('toJSON', {
  transform(doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export interface City extends mongoose.Document {
  name: string;
}
