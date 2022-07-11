import { StatusCodes } from 'http-status-codes';

abstract class CustomApiError extends Error {
  abstract readonly statusCode: StatusCodes;

  constructor(message: string) {
    super(message);
  }
}

export default CustomApiError;
