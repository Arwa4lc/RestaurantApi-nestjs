import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Model } from 'mongoose';
import { User } from 'src/auth/auth.model';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsDuplicatedConstraint implements ValidatorConstraintInterface {
  constructor(@InjectModel('User') private readonly user: Model<User>) {}

  async validate(email: string, args: ValidationArguments) {
    const user = await this.user.findOne({ email });
    if (user) return false;

    return true;
  }
}

export function IsDuplicated(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsDuplicatedConstraint,
    });
  };
}
