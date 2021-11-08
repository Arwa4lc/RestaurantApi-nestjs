import * as mongoose from 'mongoose';

export enum Role {
  Admin = 'admin',
  User = 'user',
}

export const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    trim: true,
    default: 'user',
    enum: Role,
  },
});

userSchema.set('toJSON', {
  transform(doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export interface User extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: string;
}
