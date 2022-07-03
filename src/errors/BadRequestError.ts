import { StatusCodes } from 'http-status-codes';
import CustomApiError from './CustomApiError';

class BadRequestError extends CustomApiError {
  statusCode = StatusCodes.BAD_REQUEST;

  constructor(message: string) {
    super(message);
  }
}

export default BadRequestError;
