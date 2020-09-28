import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import User from '../../../entity/User';

@ValidatorConstraint({ async: true })
export class IsNotUserAlreadyExistConstraint implements ValidatorConstraintInterface {
  validate(email: string) {
    return User.findOne({ email }).then(user => {
      return user ? true : false
    })
  }
}

export function IsNotUserAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNotUserAlreadyExistConstraint,
    });
  };
}