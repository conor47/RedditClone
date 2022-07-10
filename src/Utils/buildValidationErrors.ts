import { ValidationError } from 'class-validator';

export const buildValidationErrors = (errors: ValidationError[]) => {
  return errors.reduce((acc: any, err: any) => {
    acc[err.property] = Object.entries(err.constraints)[0][1];
    return acc;
  }, {});
};
